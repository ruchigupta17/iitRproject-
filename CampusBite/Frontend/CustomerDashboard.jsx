import React, { useEffect, useState } from "react";
import api from "../api";

export default function CustomerDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRest, setSelectedRest] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/restaurants").then((res) => setRestaurants(res.data));
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    api.get("/orders/my").then((res) => setOrders(res.data));
  };

  const selectRestaurant = (rest) => {
    setSelectedRest(rest);
    setCart([]);
    api.get(`/restaurants/${rest.id}/menu`).then((res) => setMenu(res.data));
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menu_item_id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menu_item_id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const placeOrder = async () => {
    if (!address || cart.length === 0) return alert("Enter hostel/block address and add items.");
    await api.post("/orders", {
      restaurant_id: selectedRest.id,
      delivery_address: address,
      items: cart.map(({ menu_item_id, quantity }) => ({ menu_item_id, quantity })),
    });
    setCart([]);
    setAddress("");
    fetchOrders();
  };

  return (
    <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
      <div>
        <h2>Campus Restaurants</h2>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          {restaurants.map((r) => (
            <button key={r.id} onClick={() => selectRestaurant(r)}>
              {r.name} ({r.campus_zone})
            </button>
          ))}
        </div>

        {selectedRest && (
          <>
            <h3>Menu — {selectedRest.name}</h3>
            {menu.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>{item.name} — ₹{item.price}</span>
                <button onClick={() => addToCart(item)}>+ Add</button>
              </div>
            ))}
          </>
        )}

        <h3 style={{ marginTop: "2rem" }}>Live Order Tracking</h3>
        {orders.map((o) => (
          <div key={o.id} style={{ padding: "0.75rem", border: "1px solid #ccc", marginBottom: "0.5rem" }}>
            <strong>Order #{o.id}</strong> | ₹{o.total_amount} | Status: <span>{o.status.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <div style={{ border: "1px solid #ddd", padding: "1rem" }}>
        <h3>Your Cart</h3>
        {cart.map((c) => (
          <p key={c.menu_item_id}>{c.name} x {c.quantity} = ₹{c.price * c.quantity}</p>
        ))}
        <input
          type="text"
          placeholder="Hostel / Library / Lab Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%", marginBottom: "0.75rem", padding: "0.5rem" }}
        />
        <button onClick={placeOrder} disabled={cart.length === 0}>
          Place Order
        </button>
      </div>
    </div>
  );
}