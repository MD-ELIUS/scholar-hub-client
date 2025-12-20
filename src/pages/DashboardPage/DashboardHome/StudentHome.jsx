import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingScreen from "../../../components/Loading/LoadingScreen";

// Recharts imports
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
  CartesianGrid
} from "recharts";

//  Animation
import { motion } from "framer-motion";
import LoadingData from "../../../components/Loading/LoadingData";

const StudentHome = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: applications = [],
    isLoading: applicationsLoading,
  } = useQuery({
    queryKey: ["applications", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/applications?userEmail=${user.email}`
      );
      return res.data;
    },
  });

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
  } = useQuery({
    queryKey: ["reviews", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/reviews?userEmail=${user.email}`
      );
      return res.data;
    },
  });

  if (loading || applicationsLoading || reviewsLoading) {
    return <LoadingData />;
  }

  const totalApplications = applications.length;
  const pending = applications.filter((app) => app.applicationStatus === "pending").length;
  const processing = applications.filter((app) => app.applicationStatus === "processing").length;
  const completed = applications.filter((app) => app.applicationStatus === "completed").length;
  const rejected = applications.filter((app) => app.applicationStatus === "rejected").length;
  const totalReviews = reviews.length;

  const paidApplications = applications.filter(
    (app) => app.paymentStatus === "paid"
  );

  const totalSpent = paidApplications.reduce(
    (sum, app) =>
      sum +
      (Number(app.applicationFees || 0) +
        Number(app.serviceCharge || 0)),
    0
  );


  const pieData = [
    { name: "Pending", value: pending },
    { name: "Processing", value: processing },
    { name: "Completed", value: completed },
    { name: "Rejected", value: rejected },
  ];

  const pieColors = ["#F4B400", "#16756D", "#4CAF50", "#F44336"];

  const barData = applications.reduce((acc, app) => {
    const name = app.scholarshipName || `App ${app.id}`;
    const existing = acc.find((item) => item.name === name);
    if (existing) {
      existing.fees += Number(app.applicationFees || 0);
      existing.serviceCharge += Number(app.serviceCharge || 0);
    } else {
      acc.push({
        name,
        fees: Number(app.applicationFees || 0),
        serviceCharge: Number(app.serviceCharge || 0),
      });
    }
    return acc;
  }, []);

  const latestBarData = barData.slice(-4);

  const cardStyle =
    "bg-white shadow-md rounded-bl-2xl rounded-tr-2xl border border-secondary/50 p-6 text-center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Cards */}
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
          { title: "My Applications", value: totalApplications },
          { title: "My Reviews", value: totalReviews },
          { title: "Total Fees", value: `$${totalSpent.toFixed(2)}` },
          {
            title: "Average Fee",
            value: `$${totalApplications ? (totalSpent / totalApplications).toFixed(2) : "0.00"}`,
          },
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-1 lg:col-span-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="bg-white shadow-md rounded-bl-2xl rounded-tr-2xl border border-secondary/50 p-6"
        >
          <h2 className="text-lg text-primary font-semibold mb-4 text-center">
            Application Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
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

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-white shadow-md rounded-bl-2xl rounded-tr-2xl border border-secondary/50 p-6"
        >
          <h2 className="text-lg text-primary font-semibold mb-4 text-center">
            Latest Applications
          </h2>

          <div
            className="overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/50 scrollbar-track-gray-200"
            style={{ maxHeight: 500 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={latestBarData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={90}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="fees" fill="#16756D" barSize={20} />
                <Bar dataKey="serviceCharge" fill="#F4B400" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentHome;
