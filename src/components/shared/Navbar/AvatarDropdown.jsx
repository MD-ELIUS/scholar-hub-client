import { LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";


import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";

const AvatarDropdown = () => {
const {user, logOut } = useAuth() ;
 
    const handleLogOut = () => {
        logOut()
        .then()
        .catch(error => {
            console.log(error)
        })
    }  // ⬅️ Direct access from hook
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 lg:w-14 lg:h-14 rounded-full overflow-hidden border border-gray-300 
        flex items-center justify-center bg-[#16756D]"
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="User"
            className="w-full h-full object-cover"
          />
        ) : (
          <FaGraduationCap className="text-white text-lg" />
        )}
      </button>

      {/* Dropdown */}
      <div
  className={`absolute right-0 mt-4 max-w-48 bg-primary shadow-lg rounded-bl-2xl rounded-tr-2xl 
  transition-all duration-200
  ${open ? "opacity-100 scale-100 z-50" : "opacity-0 scale-95 pointer-events-none"}`}
>
  <ul className="flex flex-col gap-2 text-white py-2 mx-2">

    {/* Dashboard */}
    <li>
      <Link
        to="/dashboard"
        className="flex items-center gap-2 px-3 py-2 w-full text-lg font-medium hover:bg-secondary rounded-bl-2xl rounded-tr-2xl "
        onClick={() => setOpen(false)}
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </Link>
    </li>

    {/* Logout */}
    <li>
      <button
        onClick={() => {
          handleLogOut(),
          setOpen(false);
        }}
        className="flex items-center gap-2 px-3 py-2 w-full text-lg font-medium btn btn-secondary btn-outline rounded-bl-2xl rounded-tr-2xl "
      >
       <FiLogOut />
        <span>Logout</span>
      </button>
    </li>

  </ul>
</div>

    </div>
  );
};

export default AvatarDropdown;
