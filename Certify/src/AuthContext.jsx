import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getUserById, updateUser as updateUserApi, deleteUser as deleteUserApi } from './services/api'

const AuthContext = createContext();

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user._id || user.id,  // Ensure id is always present
  };
};

export const AuthProvider = ({ children }) => {
  // Store logged in user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  //Check if user is already logged in from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Fetch fresh user data from backend
      getUserById(parsedUser.id)
        .then((res) => {
          const freshUser = normalizeUser(res.data);
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        })
        .catch((error) => {
          console.error("Error fetching fresh user data:", error);
          logout(); // Clear stale data if fetch fails
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  //Login function
  const login = (user) => {
    const normalized = normalizeUser(user);

    setUser(normalized);
    localStorage.setItem("user", JSON.stringify(normalized));
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
      const userId = user?.id || user?._id;

      if (!user?.id) {
        throw new Error("No user ID available for update");
      }
      const res = await updateUserApi(userId, updatedUser);
      const updatedData = normalizeUser(res.data);
      setUser(updatedData);
      localStorage.setItem("user", JSON.stringify(updatedData));
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
