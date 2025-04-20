import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getUserById, updateUser as updateUserApi, deleteUser as deleteUserApi } from './services/api'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store logged in user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //Check if user is already logged in from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  //Login function
  const login = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  //Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const deleteAccount = async () => {
    try {
      if (!user?.id) {
        throw new Error("No user ID found");
      }
      await deleteUserApi(user.id);
      logout(); // Clear local user
      toast.success("Account deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete account");
      console.error("Error deleting account:", error);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      if (!user?.id) {
        throw new Error("No user ID available for update");
      }
      const res = await updateUserApi(user.id, updatedUser);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating user:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.request,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, deleteAccount, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
