from typing import Optional

from fastapi import APIRouter, HTTPException

try:
    import httpx
except ImportError:
    httpx = None

from app.database import supabase
from app.schemas import VehicleResponse

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


AUTOBOX_API = "https://www.autobox.mn/api/services/app/Xyp/GetAutoboxInfo"


async def _lookup_autobox(search_type: str, value: str) -> Optional[VehicleResponse]:
    normalized = value.strip().upper()
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(
                AUTOBOX_API,
                params={"searchType": search_type, "searchValue": normalized},
            )
            resp.raise_for_status()
            body = resp.json()
        result = body.get("result")
        if not result or not result.get("vehicle"):
            return None
        v = result["vehicle"]
    except Exception:
        return None

    def _safe(val):
        if val is None or val == "" or val == "-":
            return None
        return val

    def _safe_int(val):
        if val is None or val == "" or val == "-":
            return None
        try:
            return int(str(val).replace(" ", "").replace(",", ""))
        except (ValueError, TypeError):
            return None

    def _get(*keys):
        for k in keys:
            val = v.get(k)
            if val is not None and val != "" and val != "-":
                return val
        return None

    def _safe_str_from_int(val):
        i = _safe_int(val)
        return str(i) if i is not None else None

    return VehicleResponse(
        plate_number=_get("plateNo", "plateNumber", "regNo") or normalized,
        vin=_get("cabinNo", "vinNo", "vinNumber", "vin"),
        make=_get("markName", "makeName", "make", "mark"),
        model=_get("modelName", "model"),
        purpose=_get("purposeDisplay", "purpose", "usageType"),
        manufacture_year=_safe_int(_get("buildYear", "manufactureYear", "yearMade", "year", "manufacture_year")),
        imported_date=_get("importDate", "importedDate", "imported_date"),
        country=_get("countryName", "country", "originCountry"),
        color=_get("colorName", "color"),
        special_purpose=_get("specialName", "specialPurpose", "special_purpose"),
        steering_class=_get("steeringClass", "steering_class", "steeringTypeName"),
        fuel_type=_get("fuelName", "fuelTypeName", "fuelType", "fuel_type"),
        seat_count=_safe_int(_get("seatCount", "seat_count")),
        engine_capacity=_get("engineCapacity", "engine_capacity"),
        drive_type=_get("wheelName", "driveType", "drive_type"),
        steering_position=_get("steeringPosition", "steering_position", "className"),
        height=_safe_str_from_int(_get("height")),
        width=_safe_str_from_int(_get("width")),
        length=_safe_str_from_int(_get("length")),
        weight=_safe_str_from_int(_get("ownWeight", "weight", "curbWeight")),
        gross_weight=_safe_str_from_int(_get("totalWeight", "grossWeight", "gross_weight")),
        payload=_safe_str_from_int(_get("maxLoad", "payload")),
        engine_type=_get("engineModelName", "engineType", "engine_type"),
        axle_count=_safe_int(_get("axleCount", "axle_count")),
    )


def _query_supabase(column: str, value: str) -> VehicleResponse:
    if supabase is None:
        raise HTTPException(status_code=503, detail="Серверийн алдаа гарлаа")

    normalized = value.strip().upper()

    try:
        result = (
            supabase.table("vehicles")
            .select("*")
            .ilike(column, normalized)
            .maybe_single()
            .execute()
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Серверийн алдаа гарлаа")

    if not result.data:
        raise HTTPException(
            status_code=404, detail="Тээврийн хэрэгслийн мэдээлэл олдсонгүй"
        )

    try:
        return VehicleResponse(**result.data)
    except Exception:
        raise HTTPException(status_code=500, detail="Серверийн алдаа гарлаа")


@router.get("/makes")
async def list_makes():
    if supabase is None:
        raise HTTPException(status_code=503, detail="Серверийн алдаа гарлаа")
    try:
        result = supabase.table("vehicles").select("make").execute()
    except Exception:
        raise HTTPException(status_code=500, detail="Серверийн алдаа гарлаа")
    makes = sorted({row["make"] for row in result.data if row.get("make")})
    return makes


@router.get("/models")
async def list_models(make: Optional[str] = None):
    if supabase is None:
        raise HTTPException(status_code=503, detail="Серверийн алдаа гарлаа")
    try:
        query = supabase.table("vehicles").select("model")
        if make:
            query = query.ilike("make", make.strip().upper())
        result = query.execute()
    except Exception:
        raise HTTPException(status_code=500, detail="Серверийн алдаа гарлаа")
    models = sorted({row["model"] for row in result.data if row.get("model")})
    return models


@router.get("/search", response_model=VehicleResponse)
async def search_vehicle(type: str, value: str):
    search_type = "plate" if type == "plate" else "vin"
    column = "plate_number" if type == "plate" else "vin"
    result = await _lookup_autobox(search_type, value)
    if result is not None:
        return result
    if supabase is None:
        raise HTTPException(status_code=503, detail="Серверийн алдаа гарлаа")
    return _query_supabase(column, value)


@router.get("/{plate_number}", response_model=VehicleResponse)
async def lookup_vehicle(plate_number: str):
    result = await _lookup_autobox("plate", plate_number)
    if result is not None:
        return result
    if supabase is None:
        raise HTTPException(status_code=503, detail="Серверийн алдаа гарлаа")
    return _query_supabase("plate_number", plate_number)
