import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  const alertShownRef = useRef(false);

  // Step 1: Confirm payment & get metadata
  useEffect(() => {
    if (!sessionId || alertShownRef.current) return;

    const confirmPayment = async () => {
      try {
        const res = await axiosSecure.post("/payment-success", { sessionId });

        if (res.data?.success) {
          setMetadata(res.data.metadata);

          if (!alertShownRef.current) {
            Swal.fire(
              "Payment Successful",
              "Your application is confirmed!",
              "success"
            );
            alertShownRef.current = true; //  mark as shown
          }
        }
      } catch (error) {
        if (!alertShownRef.current) {
          Swal.fire("Error", "Payment verification failed!", "error");
          alertShownRef.current = true;
        }
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, axiosSecure]);

  // Step 2: Fetch scholarship using scholarshipId
  const { data: scholarship, isLoading: scholarshipLoading } = useQuery({
    queryKey: ["singleScholarship", metadata?.scholarshipId],
    enabled: !!metadata?.scholarshipId,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/scholarships/${metadata.scholarshipId}`
      );
      return res.data;
    },
  });

  if (loading || scholarshipLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-dashed rounded-full border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <p className="text-center text-red-500 mt-10">
        Scholarship not found
      </p>
    );
  }

  const totalPaid =
    Number(scholarship.applicationFees) +
    Number(scholarship.serviceCharge);

  return (
    <div className="w-11/12 md:w-1/2 mx-auto py-12 space-y-6 text-center">
      <h2 className="text-3xl font-bold text-green-600">
        Payment Successful ✅
      </h2>

      <div className="bg-white shadow-lg p-6 rounded-xl text-left space-y-2">
        <h3 className="text-xl font-semibold text-primary">
          {scholarship.scholarshipName}
        </h3>
        <p className="text-secondary/70"><strong className="text-primary">University:</strong> {scholarship.universityName}</p>
        <p className="text-secondary/70"><strong className="text-primary">Degree:</strong> {scholarship.degree}</p>
        <p className="text-secondary/70"><strong className="text-primary">Category:</strong> {scholarship.scholarshipCategory}</p>

        <hr className="my-3" />

        <p className="text-lg font-bold text-green-700">
          Amount Paid: ${totalPaid}
        </p>
      </div>

      <button
        onClick={() => navigate("/dashboard/my-applications")}
        className=" btn btn-secondary btn-outline  rounded-bl-2xl rounded-tr-2xl font-semibold transition"
      >
        Go to My Applications
      </button>
    </div>
  );
};

export default PaymentSuccess;
