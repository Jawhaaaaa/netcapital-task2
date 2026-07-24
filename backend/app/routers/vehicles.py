from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException

from app.database import supabase
from app.schemas import VehicleResponse

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


async def _lookup_autobox(value: str) -> VehicleResponse:
    """Look up a vehicle by plate number or VIN via the autobox.mn API."""
    normalized = value.strip().upper()

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                "https://www.autobox.mn/api/services/app/Xyp/GetAutoboxInfo",
                params={"plateNo": normalized},
            )
            resp.raise_for_status()
            body = resp.json()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Серверийн алдаа гарлаа")
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Серверийн алдаа гарлаа")
    except Exception:
        raise HTTPException(status_code=500, detail="Серверийн алдаа гарлаа")

    result = body.get("result") or {}
    if result.get("errorMessage") or not result.get("vehicle"):
        raise HTTPException(
            status_code=404,
            detail="Тээврийн хэрэгслийн мэдээлэл олдсонгүй",
        )

    v = result["vehicle"]

    def _get(*keys):
        for k in keys:
            val = v.get(k)
            if val is not None:
                return val
        return None

    return VehicleResponse(
        plate_number=_get("plateNo", "plateNumber", "regNo") or normalized,
        vin=_get("vinNo", "vinNumber", "vin"),
        make=_get("makeName", "make", "mark", "markName"),
        model=_get("modelName", "model"),
        purpose=_get("purpose", "usageType"),
        manufacture_year=_get("manufactureYear", "yearMade", "year", "manufacture_year"),
        imported_date=_get("importDate", "importedDate", "imported_date"),
        country=_get("countryName", "country", "originCountry"),
        color=_get("colorName", "color"),
        special_purpose=_get("specialPurpose", "special_purpose"),
        steering_class=_get("steeringClass", "steering_class"),
        fuel_type=_get("fuelTypeName", "fuelType", "fuel_type"),
        seat_count=_get("seatCount", "seat_count"),
        engine_capacity=_get("engineCapacity", "engine_capacity"),
        drive_type=_get("driveType", "drive_type"),
        steering_position=_get("steeringPosition", "steering_position"),
        height=_get("height"),
        width=_get("width"),
        length=_get("length"),
        weight=_get("weight", "curbWeight"),
        gross_weight=_get("grossWeight", "gross_weight"),
        payload=_get("payload"),
        engine_type=_get("engineType", "engine_type"),
        axle_count=_get("axleCount", "axle_count"),
    )


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
    return await _lookup_autobox(value)


@router.get("/{plate_number}", response_model=VehicleResponse)
async def lookup_vehicle(plate_number: str):
    return await _lookup_autobox(plate_number)
