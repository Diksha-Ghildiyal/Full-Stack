import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../features/cart/cartSlice";

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={styles.container}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} style={styles.item}>
              <p>
                <strong>{item.name}</strong> - ${item.price} × {item.quantity}
              </p>
              <div>
                <button
                  onClick={() =>
                    dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <button
                  onClick={() =>
                    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                  }
                >
                  +
                </button>
                <button onClick={() => dispatch(removeFromCart(item.id))}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <h3>Total: ${total}</h3>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "20px" },
  item: {
    border: "1px solid #ddd",
    padding: "10px",
    margin: "10px",
    borderRadius: "8px",
  },
};

export default Cart;
