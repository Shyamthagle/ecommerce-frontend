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
      const updatedProduct = {
        ...product,
        quantity: selectedQuantity,
      };
      addToOrder(updatedProduct);

      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [product.id]: 0,
      }));
    } else {
      alert("Please select a quantity greater than 0");
    }
  };

  const incrementQuantity = (productId) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productId];
      const stockAvailable = products.find((p) => p.id === productId).stock;

      if (currentQuantity < stockAvailable) {
        return {
          ...prevQuantities,
          [productId]: currentQuantity + 1,
        };
      } else {
        alert("Stock limit reached!");
        return prevQuantities;
      }
    });
  };

  const decrementQuantity = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(0, prevQuantities[productId] - 1),
    }));
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
              <button
                onClick={() => decrementQuantity(product.id)}
                disabled={quantities[product.id] === 0}
              >
                -
              </button>
              <span>{quantities[product.id]}</span>
              <button
                onClick={() => incrementQuantity(product.id)}
                disabled={quantities[product.id] >= product.stock}
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleAddToOrder(product)}
              disabled={quantities[product.id] === 0}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
