from fastapi import APIRouter, HTTPException

from app.database import supabase
from app.schemas import VehicleResponse

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


def _query(column: str, value: str):
    if supabase is None:
        raise HTTPException(
            status_code=503,
            detail="Серверийн алдаа гарлаа",
        )

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


@router.get("/search", response_model=VehicleResponse)
async def search_vehicle(type: str, value: str):
    if type == "plate":
        return _query("plate_number", value)
    if type == "vin":
        return _query("vin", value)
    raise HTTPException(status_code=400, detail="Хайлтын төрөл буруу")


@router.get("/{plate_number}", response_model=VehicleResponse)
async def lookup_vehicle(plate_number: str):
    return _query("plate_number", plate_number)
