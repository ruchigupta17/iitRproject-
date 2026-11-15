import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .....venv.Backend.middleware import LoggingMiddleware
from .routers import auth, restaurants, orders, ai_insights
from ..tasks import check_unupdated_orders

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CampusBite API", version="1.0.0")

app.add_middleware(LoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(restaurants.router, prefix="/api/restaurants", tags=["Restaurants"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(ai_insights.router, prefix="/api/ai", tags=["AI Insights"])

@app.on_event("startup")
async def startup_event():
    async def background_scheduler():
        while True:
            db = SessionLocal()
            try:
                check_unupdated_orders(db)
            finally:
                db.close()
            await asyncio.sleep(300) # Run every 5 minutes
    asyncio.create_task(background_scheduler())

@app.get("/")
def read_root():
    return {"message": "Welcome to CampusBite API 🍔"}
