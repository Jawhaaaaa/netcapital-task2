from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import vehicles

app = FastAPI(title="Vehicle Lookup Demo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vehicles.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}