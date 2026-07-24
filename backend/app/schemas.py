from typing import Optional

from pydantic import BaseModel


class VehicleResponse(BaseModel):
    plate_number: str
    vin: Optional[str] = None
    make: Optional[str] = None
    model: Optional[str] = None
    purpose: Optional[str] = None
    manufacture_year: Optional[int] = None
    imported_date: Optional[str] = None
    country: Optional[str] = None
    color: Optional[str] = None
    special_purpose: Optional[str] = None
    steering_class: Optional[str] = None
    fuel_type: Optional[str] = None
    seat_count: Optional[int] = None
    engine_capacity: Optional[str] = None
    drive_type: Optional[str] = None
    steering_position: Optional[str] = None
    height: Optional[str] = None
    width: Optional[str] = None
    length: Optional[str] = None
    weight: Optional[str] = None
    gross_weight: Optional[str] = None
    payload: Optional[str] = None
    engine_type: Optional[str] = None
    axle_count: Optional[int] = None


class CarAd(BaseModel):
    make: str
    model: str
    year: int
    price: str
    link: str


class CarExportResponse(BaseModel):
    cars: list[CarAd]
    total: int
    page: int
    limit: int
    pages: int
