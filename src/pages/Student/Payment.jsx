import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const Payment = () => {
  const { scholarshipId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); // user object from AuthContext
  const [loading, setLoading] = useState(false);

  // Fetch scholarship details
  const { data: scholarship, isLoading } = useQuery({
    queryKey: ["singleScholarship", scholarshipId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/scholarships/${scholarshipId}`);
      return res.data;
    },
  });

  // Check if the logged-in user already has an application
  const { data: application, isLoading: appLoading } = useQuery({
    queryKey: ["userApplication", scholarshipId, user?.email],
    enabled: !!user?.email && !!scholarship,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/applications/check?scholarshipId=${scholarshipId}&userEmail=${user.email}`
      );
      return res.data; // returns the application if exists, null if not
    },
  });

  // totalAmount declared here so JSX can use it
  const totalAmount = scholarship
    ? Number(scholarship.applicationFees) + Number(scholarship.serviceCharge)
    : 0;

  const handlePayment = async () => {
    if (!user?.email) {
      Swal.fire("Login Required", "You must be logged in to apply!", "warning");
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Confirm Payment",
      text: `You are about to pay $${totalAmount} for this scholarship.`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Proceed to Pay",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) {
      Swal.fire("Cancelled", "Payment process was cancelled.", "info");
      return;
    }

    setLoading(true);

    try {
      const paymentInfo = {
        scholarshipId,
        userEmail: user.email,
        userName: user.displayName
      };

      const res = await axiosSecure.post("/create-checkout-session", paymentInfo);

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        Swal.fire("Error", "Failed to create payment session. Try again.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Payment initiation failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || appLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-dashed rounded-full border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!scholarship) {
    return <p className="text-center mt-10 text-red-500">Scholarship not found.</p>;
  }

  return (
    <div className="w-11/12 md:w-1/2 mx-auto py-12 space-y-6">
      <h2 className="text-2xl font-bold text-primary">
        Pay for Scholarship: {scholarship.scholarshipName}
      </h2>
      <p className="text-lg">
        Application Fee: ${Number(scholarship.applicationFees)} <br />
        Service Charge: ${Number(scholarship.serviceCharge)} <br />
        <strong>Total: ${totalAmount}</strong>
      </p>

      {application && application.paymentStatus === "paid" ? (
        <button
          className="bg-gray-500 cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold"
          disabled
        >
          Already Paid
        </button>
      ) : (
        <button
          onClick={handlePayment}
          className="bg-secondary hover:bg-secondary/80 text-white px-6 py-3 rounded-xl font-semibold transition"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay & Apply"}
        </button>
      )}
    </div>
  );
};

export default Payment;
