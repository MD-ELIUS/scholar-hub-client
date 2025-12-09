import { NavLink } from "react-router";

const NavLinkItem = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative group text-lg transition-colors duration-300
        ${isActive ? "text-[#16756D]" : "text-white hover:text-[#16756D]"}`
      }
    >
      {({ isActive }) => (
        <span className="relative">
          {label}
          <span
            className={`absolute left-0 -bottom-1 h-[2px]  bg-[#16756D] transition-all duration-300 
              ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
          ></span>
        </span>
      )}
    </NavLink>
  );
};

export default NavLinkItem;
