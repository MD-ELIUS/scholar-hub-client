import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingScreen from "../../../components/Loading/LoadingScreen";

// Recharts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Animation
import { motion } from "framer-motion";

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();

  /* ================= FETCH DATA ================= */
  const { data: users = [], isLoading: userLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const { data: scholarships = [], isLoading: scholarshipLoading } = useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const res = await axiosSecure.get("/scholarships");
      return res.data;
    },
  });

  const { data: applications = [], isLoading: appLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/applications/all");
      return res.data;
    },
  });

  if (userLoading || scholarshipLoading || appLoading) {
    return <LoadingScreen />;
  }

  /* ================= CALCULATIONS ================= */
  const totalUsers = users.length;
  const totalScholarships = scholarships.length;
  const totalApplications = applications.length;

  const expiredScholarships = scholarships.filter(
    (s) => new Date(s.deadline) < new Date()
  ).length;

  /* ================= SUBJECT CATEGORY PIE ================= */
  const subjectMap = {};
  scholarships.forEach((s) => {
    const key = s.subjectCategory || "Unknown";
    subjectMap[key] = (subjectMap[key] || 0) + 1;
  });

  const subjectPieData = Object.keys(subjectMap).map((key) => ({
    name: key,
    value: subjectMap[key],
  }));

  /* ================= FUND CATEGORY PIE ================= */
  const fundMap = {};
  scholarships.forEach((s) => {
    const key = s.scholarshipCategory || "Unknown";
    fundMap[key] = (fundMap[key] || 0) + 1;
  });

  const fundPieData = Object.keys(fundMap).map((key) => ({
    name: key,
    value: fundMap[key],
  }));

  const pieColors = ["#16756D", "#F4B400", "#4CAF50", "#F44336", "#6D4C41"];

  const cardStyle =
    "bg-white shadow-md rounded-bl-2xl rounded-tr-2xl border border-secondary/50 p-6 text-center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* ================= CARDS ================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 col-span-1 lg:col-span-2"
      >
        {[
          { title: "Total Scholarships", value: totalScholarships },
          { title: "Total Applications", value: totalApplications },
          { title: "Total Users", value: totalUsers },
          { title: "Expired Scholarships", value: expiredScholarships },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
            className={cardStyle}
          >
            <h2 className="text-lg text-primary font-semibold mb-2">
              {item.title}
            </h2>
            <p className="text-3xl text-secondary font-bold">
              {item.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-1 lg:col-span-2">
        
        {/* Subject Category */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="bg-white shadow-md rounded-bl-2xl rounded-tr-2xl border border-secondary/50 p-6"
        >
          <h2 className="text-lg text-primary font-semibold mb-4 text-center">
            Scholarship by Subject Category
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {subjectPieData.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Fund Category */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="bg-white shadow-md rounded-bl-2xl rounded-tr-2xl border border-secondary/50 p-6"
        >
          <h2 className="text-lg text-primary font-semibold mb-4 text-center">
            Scholarship by Fund Category
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fundPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {fundPieData.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default AdminHome;
