import { useState } from "react";
import { FaEyeSlash, FaEye, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import MarketStall from "../assets/MarketStall.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { loginUser } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();
  // Access the login function from the useAuth hook
  const { login } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const applyLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const credentials = { email, password }
    try {
      const res = await loginUser(credentials);
      const user = res.data;

        toast.success("Login successful");
        login(user);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
    } catch (error) {
      toast.error("Login failed, enter valid credentials");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className=" bg-green-50 h-screen py-4 overflow-hidden pt-0">
      <div className="mx-auto h-screen flex flex-col gap-3 sm:gap-7 sm:flex-row sm:items-center sm:w-11/12">
        <div className="h-[60%] w-full sm:w-1/2 mb-4 sm:h-4/5">
          <img
            src={MarketStall}
            alt="A happy shopper"
            className="h-full w-full object-cover object-center rounded-b-[50%] sm:rounded-b-none "
          />
        </div>
        <div className="w-4/5 mx-auto  sm:w-1/2">
          <form
            className="flex flex-col gap-5 lg:w-4/5 sm:mx-auto"
            onSubmit={applyLogin}
          >
            <div className="bg-secondary p-4 rounded relative flex items-center gap-2">
              <MdEmail className="size-4" />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                disabled={loading}
                className="outline-0 focus:ring-2 focus:ring-primary rounded"
              />
            </div>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            <div className="bg-secondary p-4 rounded relative flex items-center gap-2">
              <FaLock className="size-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                disabled={loading}
                className="outline-0 focus:ring-2 focus:ring-primary rounded"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-auto focus:outline-none"
              >
                {showPassword ? (
                  <FaEye className="size-4" />
                ) : (
                  <FaEyeSlash className="size-4" />
                )}
              </button>
            </div>
            <button
              className="bg-primary p-4 rounded text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
