import React, { useState, useEffect } from "react";
import axios from "axios"; 
import ProductList from "./components/products/ProductList";
import Cart from "./components/cart/Cart";

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/products");
      setProducts(response.data.data); // Adjust according to your API response structure
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Please try again later.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: product.quantity }];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Place order and update product stock
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
      // Place order
      const orderResponse = await axios.post("http://localhost:3002/orders", {
        orderItems: { products: productsToUpdate, totalAmount },
      });

      if (orderResponse?.data) {
        // Update product stock
        await Promise.all(
          productsToUpdate.map((product) =>
            axios.patch(`http://localhost:3001/products/${product.productId}`, {
              quantity: product.quantity,
            }).catch((error) => {
              console.error("Error updating product stock:", error);
              alert("Error updating product stock.");
            })
          )
        );

        // Refetch products to ensure data is up to date
        await fetchProducts();

        // Clear the cart after successful order
        setCartItems([]);
      } else {
        alert(`Error placing the order: ${orderResponse.data.message}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing the order.");
    }
  };

  return (
    <div className="container">
      <ProductList addToOrder={addToCart} products={products} />
      <Cart
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        placeOrder={placeOrder}
      />
    </div>
  );
};

export default App;
