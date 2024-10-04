const [cartItems, setCartItems] = useState([]);

const addToOrder = (product) => {
  setCartItems((prevItems) => {
    const existingItem = prevItems.find(item => item.id === product.id);

    if (existingItem) {
      return prevItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + product.quantity }
          : item
      );
    } else {
      return [...prevItems, { ...product, quantity: product.quantity }];
    }
  });
};
