import React from "react";

import StudentHome from "./DashboardHome/StudentHome";
import ModeratorHome from "./DashboardHome/ModeratorHome";
import AdminHome from "./DashboardHome/AdminHome";
import useRole from "../../hooks/useRole";

const DashboardHomeLayout = () => {

  const { role} = useRole();


  // 🔹 Conditional rendering based on role
  if (role === "student") return <StudentHome />;
  if (role === "moderator") return <ModeratorHome />;
  if (role === "admin") return <AdminHome />;


};

export default DashboardHomeLayout;
