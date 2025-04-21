import data from "../data/data.json" assert { type: "json" };
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { loadData } from "./userController.mjs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE_PATH = join(__dirname, "../data/data.json");

const saveDataToFile = async () => {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
    console.log("Data saved to file successfully");
  } catch (error) {
    console.error("Error saving data to file:", error);
    throw new Error("Failed to save data");
  }
};

const getAllReviews = (req, res) => {
  const reviewsWithUser = data.reviews.map((review) => {
    const user = data.users.find((u) => u.id === review.userId);
    return {
      ...review,
      user: user
        ? {
            fullName: user.fullName,
            photoUrl: user.photoUrl,
          }
        : null,
    };
  });

  res.json(reviewsWithUser);
};



const createReview = async (req, res) => {
  const { userId, rating, comment } = req.body;
  if (!userId || !rating) {
    return res
      .status(400)
      .json({ message: "UserId and rating are required" });
  }
  try {
    const fullData = await loadData();
    const user = fullData.users.find(u => String(u.id) === String(userId));

    const newReview = {
      id: Date.now().toString(),
      userId,
      rating,
      userPhotoUrl: user?.photoUrl || "", // ✅ automatically insert from backend
      comment: comment || "",
      createdAt: new Date().toISOString(),
    };

  data.reviews.push(newReview);
  await saveDataToFile();

  res.status(201).json(newReview);
  } catch (error) {
    data.reviews.pop(); // Rollback on failure
    res.status(500).json({ message: "Failed to save review", error: error.message });
  }
};


export { getAllReviews, createReview };
