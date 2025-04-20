import { useMemo, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./Dashboard.css";

import { useAuth } from "./AuthContext";
import { getProducts } from "./services/api";
import { IoSearchOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { assets } from "./Data/assets";
import discounts from "./Data/discounts";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //function to get random products for featured products section

  //Fetch products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  if (!user) return navigate("/login");

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products; // Show all products if no search query
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const getRandomProduct = (arr, num) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };
  const randomProducts = getRandomProduct(products, 12);

  //sort the random products by lowest price
  const sortedRandomProducts = [...randomProducts].sort(
    (a, b) => a.price - b.price
  );

  //function to get random products from each category for category section
  const getRandomFromEachCategory = (products) => {
    const groupByCategory = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});

    //get one random product from each category
    return Object.keys(groupByCategory).map((category) => {
      const categoryProducts = groupByCategory[category];
      const randomIndex = Math.floor(Math.random() * categoryProducts.length);
      return categoryProducts[randomIndex];
    });
  };

  const randomCategoryProducts = useMemo(() => getRandomFromEachCategory(products), [products])

  const addToCart = async (productId) => {
    if (!user) {
      toast.error("Please log in to add to cart");
      return;
    }

    if (cartItems[productId]) {
      toast.info("Already in cart");
      return;
    }

    try {
      const checkResponse = await fetch(
        `http://localhost:8000/api/carts?userId=${user.id}&productId=${productId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const existingItems = await checkResponse.json();

      if (existingItems.length > 0) {
        toast.info("Item already in cart");
        setCartItems((prev) => ({ ...prev, [productId]: true }));
        return;
      }

      const response = await fetch("http://localhost:8000/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, productId }),
      });
      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }
      const newCartItem = await response.json();
      setCartItems((prev) => ({ ...prev, [productId]: true }));
      toast.success("Added to cart");
    } catch (error) {
      console.error("Error adding to cart", error);
      toast.error("Failed to add to cart");
    }
  };
  //Memoize the function to avoid re-randomizing the products on every render

  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="bg-green-50 min-h-screen flex items-center justify-center">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-green-50 min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-green-50 min-h-screen">
      <div className="">
        <div className="flex justify-center items-center py-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center justify-between bg-secondary p-2 rounded-xl gap-2 sm:w-3/6"
          >
            <input
              type="text"
              placeholder="Search for groceries or categories"
              className="outline-0 flex-grow cursor-pointer"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <IoSearchOutline className="cursor-pointer" />
            </button>
          </form>
        </div>

        <div className="pb-4">
          <Swiper
            modules={[EffectCoverflow]}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={"auto"}
            spaceBetween={100} //check other nums
            coverflowEffect={{
              rotate: 0, //try 50
              stretch: 50,
              depth: 200,
              modifier: 1, // try 1
            }}
            className="h-28 sm:h-36 sm:w-[600px]  "
          >
            {discounts.map((discount) => (
              <SwiperSlide key={discount.id}>
                <img
                  src={assets[discount.image]}
                  alt={discount.image}
                  className="object-cover object-center w-[95%] transition-all duration-300 "
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mx-4 sm:mx-8 sm:my-8 my-2">
          <p className="font-semibold capitalize px-4 pb-1">
            {searchQuery ? "Search Results" : "Featured Products"}
          </p>
          {filteredProducts.length === 0 && searchQuery ? (
            <p className="text-center text-gray-600 p-4">
              No products found for '{searchQuery}'
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-8 p-4">
              {(searchQuery ? filteredProducts : randomProducts).map(
                (product) => (
                  <div
                    className=" shadow-md"
                    key={product.id}
                    onClick={() => openProductDetails(product)}
                  >
                    <img
                      src={assets[product.image]}
                      alt={product.name}
                      className="w-26 h-14 object-cover rounded cursor-pointer sm:h-72 sm:w-full"
                    />
                    <p className="overflow-hidden text-ellipsis w-24 sm:w-full">
                      {product.name}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>

{!searchQuery && (
        <div className="my-2 sm:mb-8 mt-4 mx-4 sm:mx-8">
          <div className="flex justify-between items-center">
            <p className="font-semibold capitalize pb-1 px-4">categories</p>
            <NavLink to="/categories">
              <span>See all</span>
            </NavLink>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-8 p-4">
            {randomCategoryProducts.map((product) => (
              <div
                className="shadow-md"
                key={product.id}
                onClick={() => navigate(`/categories?category=&{encodeURIComponent(product.category)}`)}
              >
                <img
                  src={assets[product.image]}
                  alt={product.name}
                  className="w-26 h-14 object-cover rounded cursor-pointer sm:h-72 sm:w-full"
                />
                <p className="overflow-hidden text-ellipsis w-24">
                  {product.category}
                </p>
              </div>
            ))}
          </div>
        </div>
)}

        {!searchQuery && (
          <div className="mt-1">
            <p className="capitalize text-sm bg-primary px-4 sm:px-8 py-1 text-white">
              special deals
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-8 p-4">
              {sortedRandomProducts.map((product) => (
                <div
                  className="sm:my-4 shadow-md"
                  key={product.id}
                  onClick={() => openProductDetails(product)}
                >
                  <img
                    src={assets[product.image]}
                    alt={product.name}
                    className="w-28 h-14 object-cover rounded sm:h-72 sm:w-full cursor-pointer"
                  />

                  <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col">
                    <p className="capitalize overflow-hidden text-ellipsis w-24 sm:w-full">
                      {product.name}
                    </p>
                    <p className="font-bold text-primary">{`$${product.price}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

export default Dashboard;
