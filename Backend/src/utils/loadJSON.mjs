import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE_PATH = join(__dirname, "../data/data.json");

export const loadData = async () => {
  const fileContent = await fs.readFile(DATA_FILE_PATH, "utf8");
  return JSON.parse(fileContent);
};

export const saveDataToFile = async (data) => {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
    console.log("Data saved to file successfully");
  } catch (error) {
    console.error("Error saving data to file:", error);
    throw new Error("Failed to save data");
  }
};
