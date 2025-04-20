import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";

import { assets } from "../Data/assets";
import { getCarts, getProducts, api, createReview } from "../services/api";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  //const [quantities, setQuantities] = useState({});
  const [carts, setCarts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const shouldShowModalRef = useRef(false);

  const currentDate = new Date();

  const deliveryOptions = [
    { days: 5, cost: 0.0, label: "Standard (5 days)" },
    { days: 3, cost: 4.99, label: "Standard (3 days)" },
    { days: 1, cost: 9.99, label: "Standard (1 days)" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (showRating) shouldShowModalRef.current = true;
  }, [showRating]);

  useEffect(() => {
    if (!user) {
      setCarts([]);
      return;
    }
    const fetchCart = async () => {
      try {
        const res = await getCarts(user.id);
        const data = Array.isArray(res.data) ? res.data : [];
        setCarts(data);
        if (!selectedDelivery) setSelectedDelivery(deliveryOptions[0]);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart items.");
      }
    };
    fetchCart();
  }, [user]);

  const cartProducts = carts
    .map((cart) => ({
      ...products.find(
        (product) => String(product.id) === String(cart.productId)
      ),
      cartId: cart.id,
      quantity: cart.quantity || 1,
    }))
    .filter(Boolean);

  const addItem = async (productId, cartId) => {
    const cart = carts.find((c) => c.id === cartId);
    const newQuantity = (cart.quantity || 1) + 1;
    try {
      await api.patch(`/carts/${cartId}`, { quantity: newQuantity });
      setCarts((prev) =>
        prev.map((cart) =>
          cart.id === cartId ? { ...cart, quantity: newQuantity } : cart
        )
      );
      toast.success("Added one more to cart");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    }
  };

  const removeItem = async (productId, cartId) => {
    const cart = carts.find((c) => c.id === cartId);
    const currentQty = cart.quantity || 1;
    const newQuantity = currentQty - 1;

    try {
      if (newQuantity <= 0) {
        await api.delete(`/carts/${cartId}`);
        setCarts((prevCarts) => prevCarts.filter((cart) => cart.id !== cartId));
        toast.success("Item removed from cart");
      } else {
        await api.patch(`/carts/${cartId}`, { quantity: newQuantity });
        setCarts((prev) =>
          prev.map((cart) =>
            cart.id === cartId ? { ...cart, quantity: newQuantity } : cart
          )
        );
        toast.success("Removed one from cart");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const getSubTotal = () => {
    return cartProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
  };

  const placeOrder = async () => {
    if (!selectedDelivery) {
      toast.error("Please select a delivery option");
      return;
    }
    setIsOrdering(true);
    const orderData = {
      userId: user.id,
      items: cartProducts.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      subtotal: getSubTotal(),
      shipping: selectedDelivery.cost,
      tax: getSubTotal() * 0.1,
      total: getSubTotal() + getSubTotal() * 0.1 + selectedDelivery.cost,
      deliveryDate: new Date(
        currentDate.getTime() + selectedDelivery.days * 24 * 60 * 60 * 1000
      ).toISOString(),
      orderDate: new Date().toISOString(),
      status: "placed",
    };

    try {
      await api.post("/orders", orderData);
      await api.delete("/carts/user", { data: { userId: user.id } });

      toast.success("Order placed successfully");
      setCarts([]);
      setShowRating(true);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to placed order");
      setIsOrdering(false);
    }
  };

  const handleRating = () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }
    const reviewData = {
      userId: user.id,
      rating,
      comment,
    };
    try {
      createReview(reviewData);
      toast.success("Thank you for your feedback!");
      setShowRating(false);
      setRating(0); // Reset for next time
      setComment("");
      setIsOrdering(false);
      navigate("/history");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating");
      setShowRating(false);
      setIsOrdering(false);
      navigate("/history");
    }
  };

  const skipRating = () => {
    setShowRating(false);
    setIsOrdering(false);
    navigate("/history");
  };

  const shipping = selectedDelivery?.cost || 0;
  const taxRate = 0.1;
  const subtotal = getSubTotal();
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="bg-green-50 min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="bg-green-50 min-h-screen">
      <h2 className="text-center font-bold text-xl py-4 text-primary-text md:text-2xl">
        Cart
      </h2>
      <div className="mx-4 my-6 flex items-center justify-between">
        <p className="text-xl font-bold text-primary-text">Items</p>
        <button
          className="font-semibold text-primary cursor-pointer"
          onClick={() => navigate("/categories")}
        >
          <span className="mx-1 text-white bg-primary w-4 px-1 rounded py-0.5 ">
            +
          </span>
          Add More
        </button>
      </div>

      {cartProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cartProducts.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center mx-4 bg-secondary-text rounded-2xl shadow-2xl"
              >
                <img
                  src={assets[product.image]}
                  alt={product.name}
                  className="size-24 rounded-2xl"
                />
                <div className="w-32 md:pl-2 flex flex-col gap-4">
                  <p className="font-bold capitalize text-primary-text truncate text-ellipsis ">
                    {product.name}
                  </p>
                  <p className="text-red-600 font-semibold">
                    {`${product.price} / `}
                    <span>{product.size}</span>
                  </p>
                </div>
                <div className="self-end flex flex-col gap-2">
                  <p className="font-semibold text-primary">{`$${(
                    product.price * product.quantity
                  ).toFixed(2)}`}</p>
                  <div className="bg-primary w-20  mb-2 mr-2 rounded flex justify-between items-center px-1 text-white">
                    <span
                      className="bg-secondary-text text-primary font-bold text-lg w-4 h-4 flex justify-center items-center rounded cursor-pointer"
                      onClick={() => removeItem(product.id, product.cartId)}
                    >
                      -
                    </span>
                    <span>{product.quantity}</span>
                    <span
                      className="bg-secondary-text text-primary font-bold text-lg w-4 h-4 flex justify-center items-center rounded cursor-pointer"
                      onClick={() => addItem(product.id, product.cartId)}
                    >
                      +
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <div>
              <p className="capitalize font-bold text-xl ml-4">delivery time</p>
              <div className="grid grid-cols-1 sm:w-96 gap-4 py-4">
                {deliveryOptions.map((option) => {
                  const deliveryDate = new Date(
                    currentDate.getTime() + option.days * 24 * 60 * 60 * 1000
                  );
                  return (
                    <div
                      className="flex justify-between items-center mx-4 px-4 bg-secondary-text rounded-2xl shadow-2xl inset-shadow-sm py-2"
                      key={option.days}
                    >
                      <input
                        type="radio"
                        checked={selectedDelivery?.days === option.days}
                        onChange={() => setSelectedDelivery(option)}
                        className="size-6"
                      />
                      <div>
                        <p className="text-primary capitalize">
                          <span>{option.label},</span>{" "}
                          {deliveryDate.toLocaleDateString()}
                        </p>
                        <p className="capitalize font-semibold">
                          {option.cost === 0
                            ? "Free - shipping"
                            : `$${option.cost.toFixed(2)} - shipping`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="capitalize font-bold text-xl ml-4">
                delivery instruction
              </p>
              <div className="grid grid-cols-1 sm:w-96 gap-4 py-4">
                <div className="flex justify-between items-center mx-4 px-4 bg-secondary-text rounded-2xl shadow-2xl inset-shadow-sm py-2">
                  <input type="radio" name="delivery-mode" className="size-6" />
                  <p className="capitalize font-semibold">pay on delivery</p>
                </div>

                <div className="flex justify-between items-center mx-4 px-4 bg-secondary-text rounded-2xl shadow-2xl inset-shadow-sm py-2">
                  <input type="radio" name="delivery-mode" className="size-6" />
                  <p className="capitalize font-semibold">
                    pay before delivery
                  </p>
                </div>
              </div>
            </div>
            <div className="sm:w-96 mx-4 mt-5">
              <p className="capitalize font-bold text-xl">order summary</p>
              <div className="flex justify-between items-center mt-4">
                <p className="capitalize ">
                  items ({" "}
                  <span className="font-bold">{cartProducts.length}</span> )
                </p>
                <p className="text-primary">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="capitalize ">shipping & handling</p>
                <p className="text-primary">${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="capitalize ">total before tax</p>
                <p className="text-primary">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="capitalize ">estimated tax (10%)</p>
                <p className="text-primary">${tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center mt-3 text-primary font-bold text-lg my-4">
                <p className="capitalize">order total</p>
                <p className="text-primary">${total.toFixed(2)}</p>
              </div>

              <button
                className="bg-primary w-full text-white p-4 rounded-md mb-2 hover:opacity-80 text-lg font-semibold cursor-pointer"
                onClick={placeOrder}
                disabled={isOrdering}
              >
                {isOrdering ? "Processing Order" : "Place Your Order"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-56">
          <p className="text-2xl md:text-5xl text-primary-text">
            No items in cart yet
          </p>
        </div>
      )}

      {showRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary-text"></h2>
              <button
                type="button"
                onClick={skipRating}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-semibold mb-2">Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer text-2xl ${
                      rating >= star ? "text-yellow-400" : "text-gray-400"
                    }`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Comments (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="How was your shopping experience?"
                rows="3"
              />
            </div>
            <button
              className="mt-4 w-full bg-primary text-white py-2 rounded-lg cursor-pointer"
              onClick={handleRating}
            >
              Submit Rating
            </button>
            <button
              className="mt-2 w-full bg-gray-300 text-gray-800 py-2 rounded-lg cursor-pointer"
              onClick={skipRating}
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
