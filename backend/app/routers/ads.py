import httpx
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(tags=["ads"])


@router.get("/api/ads/search")
async def search_ads(make: Optional[str] = None, model: Optional[str] = None):
    if make is None and model is None:
        raise HTTPException(
            status_code=400, detail="Марк эсвэл загварын аль нэгийг сонгоно уу"
        )
    params = {}
    if make is not None:
        params["make"] = make
    if model is not None:
        params["model"] = model
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://ungegui-car-scraper.onrender.com/api/redirect",
                params=params,
            )
            resp.raise_for_status()
            data = resp.json()
            return {"redirect_url": data["redirect_url"]}
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Зарын үйлчилгээ хариу өгсөнгүй")
    except httpx.HTTPError:
        raise HTTPException(status_code=504, detail="Зарын үйлчилгээ хариу өгсөнгүй")
    except Exception:
        raise HTTPException(status_code=500, detail="Алдаа гарлаа")
