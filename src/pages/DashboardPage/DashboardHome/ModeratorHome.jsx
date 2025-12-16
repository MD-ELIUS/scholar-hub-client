import React from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../../../components/Loading/LoadingScreen";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// Recharts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Animation
import { motion } from "framer-motion";

const ModeratorHome = () => {
  const axiosSecure = useAxiosSecure();

  /* =========================
     FETCH APPLICATIONS (MODERATOR)
  ========================= */
  const { data: applications = [], isLoading: appLoading } = useQuery({
    queryKey: ["allApplications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/applications/all");
      return res.data;
    },
  });

  /* =========================
     FETCH REVIEWS (MODERATOR)
  ========================= */
  const { data: reviews = [], isLoading: reviewLoading } = useQuery({
    queryKey: ["allReviews"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reviews/all");
      return res.data;
    },
  });

  if (appLoading || reviewLoading) {
    return <LoadingScreen />;
  }

  /* =========================
     CALCULATIONS
  ========================= */
  const totalApplications = applications.length;
  const totalReviews = reviews.length;

  const pending = applications.filter(
    (a) => a.applicationStatus === "pending"
  ).length;

  const processing = applications.filter(
    (a) => a.applicationStatus === "processing"
  ).length;

  const completed = applications.filter(
    (a) => a.applicationStatus === "completed"
  ).length;

  const rejected = applications.filter(
    (a) => a.applicationStatus === "rejected"
  ).length;

  // Feedback Due
  const feedbackDue = applications.filter((app) => {
    if (app.applicationStatus !== "completed") return false;
    return !reviews.some(
      (review) => review.applicationId === app._id
    );
  }).length;

  const completionRate =
    totalApplications > 0
      ? ((completed / totalApplications) * 100).toFixed(1)
      : 0;

  /* =========================
     PIE DATA
  ========================= */
  const pieData = [
    { name: "Pending", value: pending },
    { name: "Processing", value: processing },
    { name: "Completed", value: completed },
    { name: "Rejected", value: rejected },
  ];

  const pieColors = ["#F4B400", "#16756D", "#4CAF50", "#F44336"];

  /* =========================
     LATEST APPLICATIONS (BAR)
  ========================= */
  const latestBarData = [...applications]
    .sort(
      (a, b) =>
        new Date(b.applicationDate) - new Date(a.applicationDate)
    )
    .slice(0, 4)
    .map((app) => ({
      name: app.scholarshipName || "Scholarship",
      fees: Number(app.applicationFees || 0),
      serviceCharge: Number(app.serviceCharge || 0),
    }));

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
          { title: "Total Applications", value: totalApplications },
          { title: "Total Reviews", value: totalReviews },
          { title: "Feedback Due", value: feedbackDue },
          { title: "Completion Rate", value: `${completionRate}%` },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-1 lg:col-span-2">
        {/* ================= PIE CHART ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="bg-white shadow-md rounded-bl-2xl rounded-tr-2xl border border-secondary/50 p-6"
        >
          <h2 className="text-lg text-primary font-semibold mb-4 text-center">
            Application Status Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ================= LATEST APPLICATIONS BAR ================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-white shadow-md rounded-bl-2xl rounded-tr-2xl border border-secondary/50 p-6"
        >
          <h2 className="text-lg text-primary font-semibold mb-4 text-center">
            Latest Applications
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={latestBarData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="fees" fill="#16756D" barSize={18} />
              <Bar dataKey="serviceCharge" fill="#F4B400" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModeratorHome;
