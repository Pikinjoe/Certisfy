import { FaHome } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { GoHistory } from "react-icons/go";
import { MdLogout } from "react-icons/md";

import { NavLink } from "react-router-dom";

const Footer = ({ setLogoutHandle }) => {
  const handleLogout = () => {
    setLogoutHandle(true);
  };

  return (
    <div className="bg-primary sticky bottom-0 w-full">
      <div className="mx-4 flex justify-between items-center p-4 sm:w-4/6 sm:mx-auto">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col justify-center items-center cursor-pointer gap-1 h-12 ${
              isActive ? "opacity-100" : "opacity-50"
            }`
          }
        >
          <FaHome className="size-6 text-white" />
          <p className="text-white text-sm">Home</p>
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `flex flex-col justify-center items-center cursor-pointer gap-1 h-12 ${
              isActive ? "opacity-100" : "opacity-50"
            }`
          }
        >
          <MdFavorite className="size-6 text-white opacity-50" />
          <p className="text-white text-sm">Favorite</p>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col justify-center items-center cursor-pointer gap-1 h-12 ${
              isActive ? "opacity-100" : "opacity-50"
            }`
          }
        >
          <GoHistory className="size-6 text-white opacity-50" />
          <p className="text-white text-sm">History</p>
        </NavLink>

        <button
          className="flex flex-col justify-center items-center gap-1 h-12 cursor-pointer"
          onClick={handleLogout}
        >
          <MdLogout className="size-6 text-white opacity-50" />
          <p className="text-white text-sm">Logout</p>
        </button>
      </div>
    </div>
  );
};

export default Footer;
