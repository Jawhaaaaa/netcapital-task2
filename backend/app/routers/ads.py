import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(tags=["ads"])


@router.get("/api/ads/search")
async def search_ads(make: str, model: str):
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://ungegui-car-scraper.onrender.com/api/redirect",
                params={"make": make, "model": model},
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
