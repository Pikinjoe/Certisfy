import { loadData, saveDataToFile } from "../utils/loadJSON.mjs";

const getAllUsers = async (req, res) => {
  try {
    const data = await loadData();

    res.json(data.users || []);
  } catch (error) {
    res.status(500).json({ message: "Failed to load users", error: error.message });
  }
};

const getUserById = async (req, res) => {
  const data = await loadData();
  const user = data.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "user not found" });
  res.json(user);
};

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }
  const data = await loadData();
  const existingUser = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password,
    fullName: username,
    photoUrl: "",
  };

  data.users.push(newUser);

  try {
    console.log("Writing to:", DATA_FILE_PATH);
    await saveDataToFile(data);
    console.log("Successfully wrote to data.json");
    res.status(201).json(newUser);
  } catch (err) {
    data.users.pop();
    console.error("Failed to write to data.json:", err);
    res.status(500).json({ message: "Failed to save user data", error: err.message });
  }
};

const updateUser = async (req, res) => {
  const data = await loadData();
  const userIndex = data.users.findIndex((u) => u.id === req.params.id);
  if (userIndex === -1)
    return res.status(404).json({ message: "user not found" });

  const originalUser = { ...data.users[userIndex] }; // Store original for rollback
  data.users[userIndex] = { ...data.users[userIndex], ...req.body };

  try {
    await saveDataToFile(data);
    res.json(data.users[userIndex]);
  } catch (err) {
    data.users[userIndex] = originalUser;
    console.error("Failed to write to data.json:", err);
    res.status(500).json({ message: "Failed to save user data", error: err.message });
  }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'})
    }
    const data = await loadData();
    const user = data.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) {
        return res.status(401).json({message: "Invalid email or password"})
    }
    res.json(user)
}

const deleteUser = async (req, res) => {
  
  const data = await loadData();
  const userIndex = data.users.findIndex((u) => u.id === req.params.id);
  if (userIndex === -1)
    return res.status(404).json({ message: "user not found" });
  const deletedUser = data.users.splice(userIndex, 1)[0]; // Remove user

  try {
    await saveDataToFile(data);
    res.status(204).send();
  } catch (err) {
    data.users.splice(userIndex, 0, deletedUser);
    console.error("Failed to write to data.json:", err);
    res.status(500).json({ message: "Failed to save user data", error: err.message });
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser, loginUser, loadData, saveDataToFile };
