import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getProducts, getCarts, api } from "../services/api";
import { assets } from "../Data/assets";
import { MdOutlineFavoriteBorder, MdFavorite } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

const Categories = () => {
  const navRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading products:", err);
        toast.error("Failed to load products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((p) => p.category.toLowerCase())),
    ];
    return ["all", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter(
      (product) =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [products, selectedCategory]);

  const categoryClick = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const res = await api.get(`/favorites?userId=${user.id}`);
        const data = res.data;
        const favoriteMap = data.reduce((acc, favorite) => {
          acc[favorite.productId] = true;
          return acc;
        }, {});
        setFavorites(favoriteMap);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    const fetchCart = async () => {
      try {
        const res = await getCarts(user.id);
        const data = Array.isArray(res.data) ? res.data : [];
        const cartMap = data.reduce((acc, cartItem) => {
          acc[cartItem.productId] = true;
          return acc;
        }, {});
        setCartItems(cartMap);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchFavorites();
    fetchCart();
  }, [user]);

  const toggleFavorite = async (productId) => {
    if (!user) {
      toast.error("Please log in to add to favorites");
      return;
    }

    const isFavorited = favorites[productId];

    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));

    try {
      if (isFavorited) {
        // Find the favorite to delete
        const findResponse = await api.get(
          `/favorites?userId=${user.id}&productId=${productId}`
        );
        const favoritesToDelete = findResponse.data;
        if (favoritesToDelete.length === 0) {
          throw new Error("Favorite not found");
        }
        const favoriteId = favoritesToDelete[0].id;

        // DELETE request
        await api.delete(`/favorites/${favoriteId}`);
        toast.success("Removed from favorites");
      } else {
        // POST request
        await api.post("/favorites", { userId: user.id, productId });
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error updating favorites", error);
      setFavorites((prev) => ({
        ...prev,
        [productId]: isFavorited,
      }));
      toast.error(`Failed to ${isFavorited ? "remove" : "add"} favorite`);
    }
  };

  const addToCart = async (productId) => {
    if (!user) {
      toast.error("Please log in to add to cart");
      return;
    }

    try {
      const checkResponse = await api.get(
        `/carts?userId=${user.id}&productId=${productId}`
      );
      const existingItems = checkResponse.data;

      if (existingItems.length > 0) {
        // Item exists, increment quantity
        const existingCart = existingItems[0];
        await api.post("/carts", {
          userId: user.id,
          productId,
          quantity: 1, // Add 1 more
        });
        setCartItems((prev) => ({ ...prev, [productId]: true }));
        toast.success("Added another to cart");
      } else {
        await api.post("/carts", { userId: user.id, productId });
        setCartItems((prev) => ({ ...prev, [productId]: true }));
        toast.success("Added to cart");
      }
    } catch (error) {
      console.error("Error adding to cart", error);
      toast.error("Failed to add to cart");
    }
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleStart = (e) => {
      isDown = true;
      startX = (e.pageX || e.touches[0].pageX) - nav.offsetLeft;
      scrollLeft = nav.scrollLeft;
    };

    const handleEnd = () => {
      isDown = false;
    };

    const handleMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = (e.pageX || e.touches[0].pageX) - nav.offsetLeft;
      const walk = (x - startX) * 1.5; // Adjust scroll speed
      nav.scrollLeft = scrollLeft - walk;
    };

    nav.addEventListener("mousedown", handleStart);
    nav.addEventListener("mouseleave", handleEnd);
    nav.addEventListener("mouseup", handleEnd);
    nav.addEventListener("mousemove", handleMove);

    nav.addEventListener("touchstart", handleStart);
    nav.addEventListener("touchend", handleEnd);
    nav.addEventListener("touchmove", handleMove);

    return () => {
      nav.removeEventListener("mousedown", handleStart);
      nav.removeEventListener("mouseleave", handleEnd);
      nav.removeEventListener("mouseup", handleEnd);
      nav.removeEventListener("mousemove", handleMove);
      nav.removeEventListener("touchstart", handleStart);
      nav.removeEventListener("touchend", handleEnd);
      nav.removeEventListener("touchmove", handleMove);
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="bg-green-50 min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-green-50 min-h-screen">
      <h2 className="text-center font-bold text-xl py-2 text-primary-text md:text-2xl capitalize">
        {selectedCategory === "all" ? "products" : selectedCategory}
      </h2>

      <div
        ref={navRef}
        className="overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => categoryClick(category)}
            className={`px-4 py-2 rounded bg-green-200 mx-2 font-semibold cursor-pointer capitalize ${
              selectedCategory === category ? "bg-primary text-white" : ""
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="shadow-md rounded bg-white h-48">
              <div className="h-3/4 relative">
                <img
                  src={assets[product.image]}
                  alt={product.name}
                  className="h-full
                 w-full object-cover cursor-pointer"
                  onClick={() => openProductDetails(product)}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    toggleFavorite(product.id);
                  }}
                >
                  {favorites[product.id] ? (
                    <MdFavorite className="text-2xl absolute right-2 top-2 text-red-500 cursor-pointer" />
                  ) : (
                    <MdOutlineFavoriteBorder className="text-2xl absolute right-2 top-2 text-white cursor-pointer" />
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center mx-1">
                <div>
                  <p className="overflow-hidden text-ellipsis w-24">
                    {product.name}
                  </p>
                  <p className="text-red-600">
                    {`${product.price} /`} <span>{product.size}</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-primary px-2 font-bold text-lg rounded-md cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product.id);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">
            No items found in this category
          </p>
        )}
      </div>

      {/* Modal for Product Details */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary-text">
                {selectedProduct.name}
              </h2>
              <button
                type="button"
                onClick={closeProductDetails}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <img
              src={assets[selectedProduct.image]}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className=" mt-2 flex justify-between items-center">
              <p className="text-red-600">{`$${selectedProduct.price} / ${selectedProduct.size}`}</p>
              <p
                className="flex items-center justify-between gap-2 bg-primary
                                     py-0.5 px-2 rounded-md text-white"
              >
                <span
                  className={
                    selectedProduct.rating <= 3.5
                      ? "text-red-600"
                      : "text-yellow-400"
                  }
                >
                  <FaStar />
                </span>
                {selectedProduct.rating}
              </p>
            </div>
            <p className="text-gray-600 mt-2 font-semibold">
              Category:{" "}
              <span className="capitalize">{selectedProduct.category}</span>
            </p>
            <p className="text-gray-600 test-sm mt-2">
              {selectedProduct.description}
            </p>
            <button
              className="mt-4 w-full bg-primary text-white py-2 rounded-lg cursor-pointer"
              type="button"
              onClick={() => {
                addToCart(selectedProduct.id);
                closeProductDetails();
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
