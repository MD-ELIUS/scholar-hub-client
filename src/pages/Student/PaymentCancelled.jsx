import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const PaymentCancelled = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const {user} = useAuth()

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch latest unpaid application for the logged-in user
  useEffect(() => {
    const fetchCancelledInfo = async () => {
      try {
        const userEmail = user.email // adjust based on your auth
        if (!userEmail) throw new Error("User not logged in");

        const res = await axiosSecure.get(
          `/payment-cancelled-info?userEmail=${userEmail}`
        );

        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch cancelled payment info:", error);
        setData({
          scholarshipName: "Scholarship",
          message: "Payment information unavailable"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledInfo();
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-dashed rounded-full border-secondary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-11/12 md:w-1/2 mx-auto py-12 space-y-6 text-center">
      <h2 className="text-3xl font-bold text-red-600">
        Payment Failed ❌
      </h2>

      <div className="bg-white shadow-lg p-6 rounded-xl text-left space-y-2">
        <h3 className="text-xl font-semibold text-primary">
          {data?.scholarshipName || "Scholarship"}
        </h3>

        <hr className="my-3" />

        <p className="text-red-600 font-semibold">
          {data?.message || "Your payment was not completed."}
        </p>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="btn btn-secondary btn-outline rounded-bl-2xl rounded-tr-2xl font-semibold transition"
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default PaymentCancelled;
