import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { ToastContainer } from "react-toastify";
import Home from "./Pages/Home";
import Dashboard from "./Dashboard";
import SignUp from "./Pages/SignUp";
import Cart from "./Pages/Cart";
import History from "./Pages/History";
import Login from "./Pages/Login";
import Navlink from "./Navlink";
import Footer from "./Footer";
import Categories from "./Pages/Categories";
import Favorites from "./Pages/Favorites";
import Profile from "./Pages/Profile";
import Review from "./Pages/Review";

function MainContent() {
  const [logoutHandle, setLogoutHandle] = useState(false);
  const { logout, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const cancelLogout = () => setLogoutHandle(false);
  const logOut = () => {
    logout();
    setLogoutHandle(false);
    navigate("/login");
  };

  const pathsWithoutNavlink = [
    "/",
    "/signup",
    "/login",
    "/cart",
    "/product/:id",
    "/profile",
    "/review",
  ];
  const pathsWithoutFooter = [
    "/",
    "/signup",
    "/login",
    "/cart",
    "/profile",
    "/review",
  ];

  if (loading) {
    return (
      <div className="text-center min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll relative">
      {pathsWithoutNavlink.includes(location.pathname) ? null : <Navlink />}
      {logoutHandle && (
        <div className="bg-primary-text w-10/12 sm:w-[500px] h-52 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute z-50 rounded-md">
          <div className="text-white ml-4 pt-6">
            <h2 className="font-bold pb-2 text-lg">Log out</h2>
            <p>Are you sure you want to log out?</p>
          </div>
          <div className="pt-16 flex justify-end gap-4 mr-4 text-primary-text">
            <button
              className="bg-white py-2 px-5 rounded-lg font-semibold hover:opacity-80 cursor-pointer"
              onClick={cancelLogout}
            >
              Cancel
            </button>
            <button
              className="bg-white py-2 px-5 rounded-lg font-semibold hover:opacity-80 cursor-pointer"
              onClick={logOut}
            >
              Ok
            </button>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute component={Dashboard} />}
        />
        <Route path="/cart" element={<ProtectedRoute component={Cart} />} />
        <Route
          path="/history"
          element={<ProtectedRoute component={History} />}
        />
        <Route
          path="/favorites"
          element={<ProtectedRoute component={Favorites} />}
        />
        <Route
          path="/categories"
          element={<ProtectedRoute component={Categories} />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              component={Profile}
              setLogoutHandle={setLogoutHandle}
            />
          }
        />
        <Route path="/review" element={<Review />} />
      </Routes>
      {pathsWithoutFooter.includes(location.pathname) ? null : (
        <Footer setLogoutHandle={setLogoutHandle} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainContent />
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

// ProtectedRoute component to protect authenticated routes
const ProtectedRoute = ({ component: Component, setLogoutHandle, ...rest }) => {
  const { user } = useAuth();
  return user ? (
    <Component setLogoutHandle={setLogoutHandle} {...rest} />
  ) : (
    <Navigate to="/login" />
  );
};

export default App;