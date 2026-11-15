import datetime
from sqlalchemy.orm import Session
from .app.models import Order, OrderStatus, AdminReminderLog

def check_unupdated_orders(db: Session):
    """Background check for orders in PLACED or ACCEPTED status for > 15 minutes without update."""
    threshold = datetime.datetime.utcnow() - datetime.timedelta(minutes=15)
    stale_orders = db.query(Order).filter(
        Order.status.in_([OrderStatus.PLACED, OrderStatus.ACCEPTED]),
        Order.updated_at < threshold
    ).all()

    for order in stale_orders:
        existing = db.query(AdminReminderLog).filter(
            AdminReminderLog.order_id == order.id,
            AdminReminderLog.is_resolved == False
        ).first()
        if not existing:
            reminder = AdminReminderLog(
                restaurant_id=order.restaurant_id,
                order_id=order.id,
                message=f"Order #{order.id} has not been updated for over 15 minutes."
            )
            db.add(reminder)
    db.commit()