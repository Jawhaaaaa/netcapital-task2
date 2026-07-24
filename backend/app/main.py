from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import ads, vehicles

app = FastAPI(title="Vehicle Lookup Demo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://netcapital-task2.vercel.app",
        "https://netcapital-task2-in0vimnsq-jawhaas-projects-61641200.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vehicles.router)
app.include_router(ads.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
