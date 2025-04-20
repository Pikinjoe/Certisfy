import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { getFavorites, getProducts } from "../services/api";
import { toast } from "react-toastify";

import { assets } from "../Data/assets";

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading products:", err);
        setLoading(false);
        toast.error("Failed to load products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await getFavorites(user.id);
        const data = Array.isArray(res.data) ? res.data : [];
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Failed to fetch favorite");
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, [user]);

  const favoriteProducts = favorites
    .map((favorite) =>
      products.find((product) => product.id === favorite.productId)
    )
    .filter(Boolean);

    if (loading) {
      return <div className="bg-green-50 min-h-screen flex items-center justify-center">Loading...</div>;

    }

  return (
    <div className="bg-green-50 min-h-screen">
      <h2 className="text-center font-bold text-xl py-4 text-primary-text md:text-2xl">
        Your Favorite Items
      </h2>
      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {favoriteProducts.map((product) => (
            <div
              className="flex justify-between items-center bg-secondary-text shadow-2xl rounded"
              key={product.id}
            >
              <img
                src={assets[product.image]}
                alt={product.name}
                className="size-24 rounded-2xl"
              />
              <p className="font-semibold text-primary-text truncate text-ellipsis w-32 md:pl-2">
                {product.name}
              </p>
              <span className="self-end pr-2 text-green-700 font-bold">
                {`$${product.price}`}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-56">
          <p className="text-2xl md:text-5xl text-primary-text">
            No Favorite items Yet
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
