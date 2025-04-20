import { useAuth } from "../AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  FaChevronLeft,
  FaChevronRight,
  FaBriefcase,
  FaUserTimes,
  FaImages,
} from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import {
  MdEmail,
  MdReviews,
  MdKey,
  MdDriveFileRenameOutline,
} from "react-icons/md";
import UpdateName from "../components/UpdateName";
import UpdatePhoto from "../components/UpdatePhoto";
import ChangePassword from "../components/ChangePassword";
import ChangeEmail from "../components/ChangeEmail";
import Review from "./Review";

const Profile = ({ setLogoutHandle }) => {
  const navigate = useNavigate();
  const { user, deleteAccount } = useAuth();
  const [activeComponent, setActiveComponent] = useState(null);

  if (!user) {
    return null;
  }

  const getInitials = (fullName) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();
  };
  const initials = getInitials(user.fullName);

  const handleDelete = () => {
    if (window.confirm('Are you sure that you want to delete your account and all associated data? This action can not be undone.')) {
      deleteAccount()
      .then(() => {
        toast.success("Account deleted successfully!");
      })
      .catch((error) => {
        toast.error("Failed to delete account");
        console.error("Error deleting account:", error);
      });
  }
  };

  const menuItems = [
    {
      icon: MdDriveFileRenameOutline,
      text: "update name",
      component: UpdateName,
      id: "name",
    },
    {
      icon: FaImages,
      text: "update profile photo",
      component: UpdatePhoto,
      id: "photo",
    },
    {
      icon: MdKey,
      text: "change password",
      component: ChangePassword,
      id: "password",
    },
    {
      icon: MdEmail,
      text: "change email address",
      component: ChangeEmail,
      id: "email",
    },
    {
      icon: MdReviews,
      text: "review",
      component: Review,
      id: "review",
    },
    {
      icon: FaBriefcase,
      text: "about us",
      action: () => console.log("About us clicked"),
    },
    {
      icon: FaUserTimes,
      text: "delete my account and data",
      action: handleDelete,
    },
    {
      icon: IoLogOut,
      text: "log out",
      action: () => setLogoutHandle(true),
    },
  ];

  const menuClick = (item) => {
    if (item.component) {
      setActiveComponent(activeComponent === item.id ? null : item.id);
    } else if (item.action) {
      item.action();
    }
  };

  const backendBaseUrl = "http://localhost:8000"; 
  const imageUrl = user.photoUrl ? `${backendBaseUrl}${user.photoUrl}` : null;

  return (
    <div className="bg-green-50 h-screen">
      <div className="bg-primary h-1/5  text-white pt-2">
        <FaChevronLeft
          className="ml-4 cursor-pointer"
          onClick={() => navigate("/categories")}
        />
        <div className="text-center flex justify-center items-center flex-col h-full pb-2">
          {user.photoUrl ? (
          <img
            src={imageUrl}
            className="h-16 w-16 bg-primary-text rounded-full object-cover"
            alt={initials}
            onError={(e) => {
              console.error("Image load error:", e);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block'
            }}
          />
          ) : null}
          <div
            className="h-16 w-16 bg-primary-text rounded-full flex items-center justify-center text-white text-3xl"
            style={{ display: user.photoUrl ? "none" : "block" }}
          >
            {initials}
          </div>

          <h3 className="capitalize text-xl">{user.fullName}</h3>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="mt-5 mx-4">
        <h2 className="capitalize font-bold text-xl">account settings</h2>

        <div className="mt-8 space-y-6">
          {menuItems.map((item, index) => (
            <div key={index}>
              <div
                className="flex justify-between items-center text-gray-500 hover:text-gray-800 cursor-pointer"
                onClick={() => menuClick(item)}
              >
                <p className="flex items-center capitalize font-semibold">
                  <item.icon className="mr-6" />
                  {item.text}
                </p>
                <FaChevronRight />
              </div>
              {item.component && activeComponent === item.id && (
                <item.component />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
