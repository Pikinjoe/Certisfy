import { useState } from "react";
import { createUser } from '../services/api'
import { MdEmail } from "react-icons/md";
import { FaEyeSlash, FaEye, FaLock, FaUser } from "react-icons/fa";
import Welcome from "../assets/Welcome.webp";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const capitalizeWords = (str) => {
    if (!str) return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const usernameChange = (e) => {
    const inputValue = e.target.value.trim();
    setUsername(capitalizeWords(inputValue));
    if (inputValue.length < 3) {
      setUsernameError("Username must be at least 3 characters long");
    } else {
      setUsernameError("");
    }
  };

  const emailChange = (e) => {
    const inputValue = e.target.value.trim();
    setEmail(inputValue);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputValue)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleVerifyPasswordVisibility = () => {
    setShowVerifyPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError(false);
    setEmailError("");
    setUsernameError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters long");
      setLoading(false);
      return;
    }

    if (password !== verifyPassword) {
      setPasswordError(true);
      setLoading(false);
      return;
    }

    const userData = { username, email, password };
    try {
      await createUser(userData)
      toast.success("Registered successfully.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error("failed:" + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-green-50 h-screen py-4 overflow-hidden">
      <div className="w-4/5 mx-auto h-screen flex flex-col gap-3 sm:gap-7 sm:flex-row sm:items-center sm:w-11/12">
        <div className=" flex flex-col gap-2 sm:w-1/2">
          <img
            src={Welcome}
            alt="placeholder image"
            className="size-36 rounded sm:size-full"
          />
          <h3 className="font-bold capitalize text-lg">getting started</h3>
          <p className="text-primary-text w-[60%] text-wrap sm:w-full">
            Welcome to Certisfy. Let's get you your profile
          </p>
        </div>
        <div className="sm:w-1/2">
          <form
            className="flex flex-col gap-5 sm:w-4/5 sm:mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="bg-secondary p-4 rounded relative flex items-center gap-2">
              <FaUser className="size-4" />
              <input
                type="text"
                required
                placeholder=" Username"
                onChange={usernameChange}
                value={username}
                className="outline-none focus:ring-2 focus:ring-primary rounded"
                disabled={loading}
              />
            </div>
            {usernameError && (
                <p className="text-red-500 text-sm">{usernameError}</p>
            )}
            <div className="bg-secondary p-4 rounded relative flex items-center gap-2">
              <MdEmail className="size-4" />
              <input
                type="email"
                required
                placeholder="Email"
                onChange={emailChange}
                value={email}
                className="outline-0 focus:ring-2 focus:ring-primary rounded"
                disabled={loading}
              />
            </div>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            <div className="bg-secondary p-4 rounded relative flex items-center gap-2">
              <FaLock className="size-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value.trim())}
                value={password}
                className="outline-0 focus:ring-2 focus:ring-primary rounded"
                disabled={loading}
              />
              <button
              type="button"
              onClick={togglePasswordVisibility}
              className="ml-auto focus:outline-none"
              >
                {showPassword ? (
                    <FaEye className="size-4"/>
                ) : (
                    <FaEyeSlash className="size-4" />
                )}
              </button>
            </div>

            <div className="bg-secondary p-4 rounded relative flex items-center gap-2">
              <FaLock className="size-4" />
              <input
                type={showVerifyPassword ? 'text' : 'password'}
                required
                placeholder="Confirm Password"
                onChange={(e) => setVerifyPassword(e.target.value.trim())}
                value={verifyPassword}
                className="outline-0 focus:ring-2 focus:ring-primary rounded"
                disabled={loading}
              />
              <button
              type="button"
              onClick={toggleVerifyPasswordVisibility}
              className="ml-auto focus:outline-none"
              >
                {showVerifyPassword ? (
                    <FaEye className="size-4"/>
                ) : (
                    <FaEyeSlash className="size-4" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm">Passwords do not match</p>
            )}
            
            <button
              className="bg-primary p-4 rounded text-white cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
