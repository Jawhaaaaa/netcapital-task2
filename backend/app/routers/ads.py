import asyncio
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

    attempts = 0
    last_error = None
    while attempts < 2:
        attempts += 1
        try:
            async with httpx.AsyncClient(timeout=45) as client:
                resp = await client.get(
                    "https://ungegui-car-scraper.onrender.com/api/redirect",
                    params=params,
                )
                resp.raise_for_status()
                data = resp.json()
                return {"redirect_url": data["redirect_url"]}
        except (httpx.TimeoutException, httpx.HTTPError) as exc:
            last_error = exc
            if attempts < 2:
                await asyncio.sleep(2)
        except Exception:
            raise HTTPException(status_code=500, detail="Алдаа гарлаа")

    if isinstance(last_error, httpx.TimeoutException):
        raise HTTPException(status_code=504, detail="Зарын үйлчилгээ хариу өгсөнгүй")
    raise HTTPException(status_code=504, detail="Зарын үйлчилгээ хариу өгсөнгүй")
