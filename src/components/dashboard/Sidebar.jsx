// src/components/dashboard/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router";

const Sidebar = ({ user }) => {
  const role = user?.role || "student";

  const common = [
    { to: "/dashboard/profile", label: "My Profile" },
  ];

  const studentLinks = [
    ...common,
    { to: "/dashboard/student/applications", label: "My Applications" },
    { to: "/dashboard/student/reviews", label: "My Reviews" },
  ];

  const moderatorLinks = [
    ...common,
    { to: "/dashboard/moderator/applications", label: "Manage Applications" },
    { to: "/dashboard/moderator/reviews", label: "All Reviews" },
  ];

  const adminLinks = [
    ...common,
    { to: "/dashboard/admin/add-scholarship", label: "Add Scholarship" },
    { to: "/dashboard/admin/scholarships", label: "Manage Scholarships" },
    { to: "/dashboard/admin/users", label: "Manage Users" },
    { to: "/dashboard/admin/analytics", label: "Analytics" },
  ];

  const links = role === "admin" ? adminLinks : role === "moderator" ? moderatorLinks : studentLinks;

  return (
    <aside className="w-72 bg-white border-r shadow-sm">
      <div className="p-6 border-b">
        <h3 className="text-xl font-bold text-primary">ScholarHub</h3>
        <p className="text-sm text-gray-500 mt-1">Dashboard</p>
      </div>

      <nav className="p-4">
        <ul className="flex flex-col gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md text-sm ${isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-primary/10"}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
