import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { getReviews, getUsers } from "../services/api";
import { toast } from "react-toastify";

const Review = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [reviewsRes, usersRes] = await Promise.all([getReviews(), getUsers()]);
  
        const reviewsData = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];
        const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
    
        const mergedReviews = reviewsData.map((review) => {
          const matchedUser = usersData.find(
            (u) => String(u.id) === String(review.userId)
          );
          return {
            ...review,
            user: matchedUser || {},
          };
        });
    
        setReviews(mergedReviews);
      } catch (error) {
        console.error("Error fetching reviews or users:", error);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="bg-green-50 h-screen flex justify-center items-center">
        <p className="text-2xl text-primary-text">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 h-screen">
      <div className="bg-primary h-1/12  text-white pt-2">
        <FaChevronLeft
          className="ml-4 cursor-pointer"
          onClick={() => navigate("/profile")}
        />
        <p className="text-center text-2xl md:text-4xl">Reviews</p>
      </div>
      {reviews.length === 0 ? (
        <div className="flex justify-center items-center h-56">
          <p className="text-2xl md:text-5xl text-primary-text">
            No reviews yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {reviews.map((review) => (
            <div
              className="text-center flex justify-center flex-col items-center gap-3 bg-white mx-4 mt-4 p-4 shadow-xl rounded-2xl"
              key={review.id}
            >
                {review.user?.photoUrl ? (
                <img
                  src={`http://localhost:8000${review.user.photoUrl}`}
                  alt={review.user.fullName || "User"}
                  className="h-16 w-16 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none"; // Hide broken image
                    e.target.nextSibling.style.display = "flex"; // Show fallback
                  }}
                />
              ) : (
                <div className="h-16 w-16 bg-primary-text rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {review.user?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <h3 className="font-semibold capitalize text-lg">
                {review.user?.fullName || "Anonymous"}
              </h3>
              <p>{review.comment || "No comment provided"}</p>
              <div className="flex gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Review;
