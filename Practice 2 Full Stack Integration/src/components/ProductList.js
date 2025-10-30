import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

const products = [
  { id: 1, name: "Laptop", price: 800 },
  { id: 2, name: "Phone", price: 500 },
  { id: 3, name: "Headphones", price: 150 },
];

function ProductList() {
  const dispatch = useDispatch();

  return (
    <div style={styles.container}>
      <h2>Products</h2>
      {products.map((product) => (
        <div key={product.id} style={styles.card}>
          <p>
            <strong>{product.name}</strong> - ${product.price}
          </p>
          <button onClick={() => dispatch(addToCart(product))}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "20px" },
  card: {
    border: "1px solid #ddd",
    padding: "10px",
    margin: "10px",
    borderRadius: "8px",
    display: "inline-block",
  },
};

export default ProductList;
