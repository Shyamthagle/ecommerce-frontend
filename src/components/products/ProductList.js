import React, { useState, useEffect } from "react";
import "./ProductList.css";

const ProductList = ({ addToOrder, products }) => {
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const initialQuantities = {};
    products.forEach((product) => {
      initialQuantities[product.id] = 0;
    });
    setQuantities(initialQuantities);
  }, [products]);

  const handleAddToOrder = (product) => {
    const selectedQuantity = quantities[product.id];

    if (selectedQuantity > 0) {
      addToOrder({ ...product, quantity: selectedQuantity });
      setQuantities((prev) => ({ ...prev, [product.id]: 0 })); // Reset quantity
    } else {
      alert("Please select a quantity greater than 0");
    }
  };

  const updateQuantity = (productId, increment) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productId];
      const stockAvailable = products.find((p) => p.id === productId).stock;

      if (increment && currentQuantity < stockAvailable) {
        return { ...prevQuantities, [productId]: currentQuantity + 1 };
      } else if (!increment && currentQuantity > 0) {
        return { ...prevQuantities, [productId]: currentQuantity - 1 };
      } else {
        alert(increment ? "Stock limit reached!" : "Cannot reduce quantity below 0!");
        return prevQuantities;
      }
    });
  };

  return (
    <div className="product-list">
      <center>
        <h1>Products</h1>
      </center>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>Stock: {product.stock}</p>

            <div className="quantity-control">
              <button onClick={() => updateQuantity(product.id, false)} disabled={quantities[product.id] === 0}>-</button>
              <span>{quantities[product.id]}</span>
              <button onClick={() => updateQuantity(product.id, true)} disabled={quantities[product.id] >= product.stock}>+</button>
            </div>

            <button onClick={() => handleAddToOrder(product)} disabled={quantities[product.id] === 0}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
