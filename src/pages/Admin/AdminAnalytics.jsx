import React from "react";
import { useQuery } from "@tanstack/react-query";



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
  LineChart,
  Line
} from "recharts";

// Animation
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import LoadingData from "../../components/Loading/LoadingData";

const AdminAnalytics = () => {
  const axiosSecure = useAxiosSecure();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/applications/all");
      return res.data;
    },
  });

  if (isLoading) return <LoadingData />;

  // 🔹 Filter only paid applications
  const paidApps = applications.filter((app) => app.paymentStatus === "paid");

  // ================= Application count per Scholarship Category (Pie Chart) =================
  const categoryMap = {};
  paidApps.forEach((app) => {
    const cat = app.scholarshipCategory || "Unknown";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const categoryPieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  // ================= Fee collection per Degree (Bar Chart) =================
  const degreeMap = {};
  paidApps.forEach((app) => {
    const degree = app.degree || "Unknown";
    degreeMap[degree] = (degreeMap[degree] || 0) + 
      Number(app.applicationFees || 0) + Number(app.serviceCharge || 0);
  });

  const degreeBarData = Object.keys(degreeMap).map((key) => ({
    degree: key,
    totalFee: degreeMap[key],
  }));

  // ================= Last 12 months fee collection (Bar Chart) =================
  const now = new Date();
const last12Months = [...Array(12)].map((_, i) => {
  const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
  const month = d.toLocaleString("default", { month: "short" });
  const year = d.getFullYear();
  return { month: `${month} ${year}`, totalFee: 0 };
}).reverse();

paidApps.forEach((app) => {
  const appDate = new Date(app.applicationDate);
  last12Months.forEach((m) => {
    const [mName, mYear] = m.month.split(" ");
    const mDate = new Date(`${mName} 1, ${mYear}`);
    if (
      appDate.getMonth() === mDate.getMonth() &&
      appDate.getFullYear() === mDate.getFullYear()
    ) {
      m.totalFee += Number(app.applicationFees || 0) + Number(app.serviceCharge || 0);
    }
  });
});


  const pieColors = ["#16756D", "#F4B400", "#4CAF50", "#F44336", "#6D4C41"];
  const barColors = ["#16756D", "#F4B400", "#4CAF50", "#F44336", "#6D4C41"];

  const cardStyle =
    "bg-white shadow-md rounded-bl-2xl rounded-tr-2xl border border-secondary/50 p-6 text-center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* ================= Application Count Pie ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className={cardStyle}
      >
        <h2 className="text-lg text-primary font-semibold mb-4 text-center">
          Applications per Scholarship Category
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryPieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {categoryPieData.map((_, i) => (
                <Cell key={i} fill={pieColors[i % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ================= Fee Collection per Degree Bar ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className={cardStyle}
      >
        <h2 className="text-lg text-primary font-semibold mb-4 text-center">
          Fee Collection per Degree
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={degreeBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="degree" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalFee" fill="#16756D" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

  {/* ================= Last 12 Months Fee Collection (Horizontal, Latest on Top) ================= */}
<motion.div
  initial={{ opacity: 0, scale: 0.97 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.45 }}
  className="bg-white shadow-md rounded-bl-2xl rounded-tr-2xl border border-secondary/50 py-6  col-span-1 lg:col-span-2"
>
  <h2 className="text-lg text-primary font-semibold mb-4 text-center">
    Last 12 Months Fee Collection
  </h2>
  <ResponsiveContainer width="100%" height={500}>
    <BarChart data={[...last12Months].reverse()} layout="vertical">
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis 
        dataKey="month" 
        type="category" 
        width={80} 
        tick={{ fontSize: 12 }} 
      />
      <Tooltip />
      <Legend />
      <Bar dataKey="totalFee" fill="#F4B400" barSize={20} />
    </BarChart>
  </ResponsiveContainer>
</motion.div>



    </motion.div>
  );
};

export default AdminAnalytics;
