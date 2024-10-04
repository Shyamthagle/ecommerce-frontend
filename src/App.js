import React, { useState, useEffect } from "react";
import axios from "axios"; 
import ProductList from "./components/products/ProductList";
import Cart from "./components/cart/Cart";

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        const { data } = await response.json();
        setProducts(data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const productExists = cartItems.find((item) => item.id === product.id);
    
    if (productExists) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      );
    } else {
      setCartItems((prevItems) => [
        ...prevItems,
        { ...product, quantity: product.quantity },
      ]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const placeOrder = async () => {
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const productsToUpdate = cartItems.map((cartItem) => ({
      productId: cartItem.id,
      quantity: cartItem.quantity,
      price: cartItem.price,
    }));

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:3002/orders", {
        orderItems: {
          products: productsToUpdate,
          totalAmount: totalAmount,
        },
      });
      console.log(response);

      if (response?.data) {
        try {
          await Promise.all(
            productsToUpdate.map(async (product) => {
              const patchResponse = await axios.patch(
                `http://localhost:3001/products/${product.productId}`,
                {
                  quantity: product.quantity,
                }
              );

              setProducts((prevProducts) =>
                prevProducts.map((p) =>
                  p.id === product.productId
                    ? { ...p, stock: p.stock - product.quantity } 
                    : p
                )
              );
              setCartItems([]);
              return patchResponse.data;
            })
          );
        } catch (error) {
          console.error("Error updating product stock:", error);
          alert("Error updating product stock.");
        }
      } else {
        alert(`Error placing the order: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <ProductList addToOrder={addToCart} products={products} /> {/* Pass products to ProductList */}
      <Cart
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        placeOrder={placeOrder}
        loading={loading}
      />
    </div>
  );
};

export default App;
