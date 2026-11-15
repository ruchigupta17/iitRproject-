import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from openai import OpenAI
from ..database import get_db
from ..models import User, UserRole, Order
from ..auth import require_role

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "dummy-key"))

@router.post("/insights")
def get_order_insights(query: str, current_user: User = Depends(require_role([UserRole.CUSTOMER])), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.customer_id == current_user.id).all()
    
    order_summary_data = []
    for o in orders:
        items_desc = ", ".join([f"{item.quantity}x {item.menu_item.name}" for item in o.items])
        order_summary_data.append(f"Order ID: {o.id}, Status: {o.status}, Amount: ₹{o.total_amount}, Items: {items_desc}, Date: {o.created_at}")

    context = "\n".join(order_summary_data)
    prompt = f"""You are CampusBite AI assistant. Here is the order history of customer {current_user.name}:
{context}

User Query: {query}
Provide a helpful, precise answer based strictly on the user's order history above."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300
        )
        return {"insight": response.choices[0].message.content}
    except Exception as e:
        # Fallback if OpenAI API key is missing or rate-limited in local testing
        return {
            "insight": f"AI service note: Received query '{query}'. You have placed {len(orders)} orders total. (Configure valid OPENAI_API_KEY for live LLM responses)."
        }