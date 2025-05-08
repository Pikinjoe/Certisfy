import Review from "../models/review.mjs";
import User from "../models/user.mjs";

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate({
      path: "userId",
      select: "fullName photoUrl",
      match: { _id: { $exists: true } },
    });

    const validReviews = reviews.filter(review => review.userId);

    const reviewsWithUser = validReviews.map((review) => ({
      id: review._id,
      userId: review.userId._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        fullName: review.userId.fullName || "Unknown User",
        photoUrl: review.userId.photoUrl || '',
      },
    }));

    res.json(reviewsWithUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to load reviews", error: error.message });
  }
};

const createReview = async (req, res) => {
  const { userId, rating, comment } = req.body;

  if (!userId || !rating) {
    return res.status(400).json({ message: "UserId and rating are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newReview = await Review.create({
      userId,
      rating,
      comment,
    });

    res.status(201).json({
      id: newReview._id,
      userId: newReview.userId,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: newReview.createdAt,
      user: {
        fullName: user.fullName,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save review", error: error.message });
  }
};

export { getAllReviews, createReview };
