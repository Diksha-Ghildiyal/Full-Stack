import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch products.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Product List</h2>
      <ul style={styles.list}>
        {products.map((product) => (
          <li key={product.id} style={styles.item}>
            <strong>{product.name}</strong> — ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Basic styling
const styles = {
  container: {
    width: "300px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    margin: "10px 0",
    background: "#f8f8f8",
    padding: "10px",
    borderRadius: "5px",
  },
};

export default ProductList;
