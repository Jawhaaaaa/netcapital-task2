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

    return VehicleResponse(
        plate_number=_safe(v.get("plateNo")),
        vin=_safe(v.get("cabinNo")),
        make=_safe(v.get("markName")),
        model=_safe(v.get("modelName")),
        purpose=_safe(v.get("purposeDisplay")),
        manufacture_year=_safe_int(v.get("buildYear")),
        imported_date=_safe(v.get("importDate")),
        country=_safe(v.get("countryName")),
        color=_safe(v.get("colorName")),
        special_purpose=_safe(v.get("specialName")),
        steering_class=_safe(v.get("className")),
        fuel_type=_safe(v.get("fuelName")),
        seat_count=_safe_int(v.get("seatCount")),
        engine_capacity=_safe(v.get("engineCapacity")),
        drive_type=_safe(v.get("wheelName")),
        steering_position=_safe(v.get("steeringTypeName")),
        height=_safe_int(v.get("height")),
        width=_safe_int(v.get("width")),
        length=_safe_int(v.get("length")),
        weight=_safe_int(v.get("ownWeight")),
        gross_weight=_safe_int(v.get("totalWeight")),
        payload=_safe_int(v.get("maxLoad")),
        engine_type=_safe(v.get("engineModelName")),
        axle_count=_safe_int(v.get("axleCount")),
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
