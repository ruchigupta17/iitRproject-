from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from .models import UserRole, OrderStatus

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    name: str

class RestaurantCreate(BaseModel):
    name: str
    campus_zone: str

class RestaurantOut(BaseModel):
    id: int
    name: str
    campus_zone: str
    owner_id: int
    class Config:
        from_attributes = True

class MenuItemCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    price: float

class MenuItemOut(BaseModel):
    id: int
    name: str
    description: str
    price: float
    is_available: bool
    restaurant_id: int
    class Config:
        from_attributes = True

class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int

class OrderCreate(BaseModel):
    restaurant_id: int
    delivery_address: str
    items: List[OrderItemCreate]

class OrderOut(BaseModel):
    id: int
    customer_id: int
    restaurant_id: int
    delivery_partner_id: Optional[int]
    status: OrderStatus
    total_amount: float
    delivery_address: str
    created_at: datetime
    class Config:
        from_attributes = True