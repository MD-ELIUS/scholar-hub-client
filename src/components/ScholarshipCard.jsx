import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/useAuth";


const ScholarshipCard = ({ scholarship }) => {
  const { user } = useAuth();

  // ✅ check if current user already applied for this scholarship
  const { data: appliedApplication } = useQuery({
    queryKey: ["applied-check", scholarship._id, user?.email],
    enabled: !!user?.email && !!scholarship?._id,
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:3000/applications/check",
        {
          params: {
            scholarshipId: scholarship._id,
            userEmail: user.email,
          },
        }
      );
      return res.data; // null or application object
    },
  });

  const isApplied = !!appliedApplication;

  return (
    <div className="relative bg-white shadow-lg rounded-2xl overflow-hidden border border-secondary/30 hover:shadow-xl transition duration-300 h-full flex flex-col">
      
      {/* Labels */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
        <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-bl-2xl rounded-tr-2xl">
          {scholarship.scholarshipCategory}
        </span>
        <span className="bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-bl-2xl rounded-tr-2xl">
          {scholarship.degree}
        </span>
        <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-bl-2xl rounded-tr-2xl">
          {scholarship.subjectCategory}
        </span>
      </div>

      {/* ✅ Applied Badge (from applications collection) */}
      {isApplied && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-2xl rounded-tr-2xl shadow-md">
            Applied
          </span>
        </div>
      )}

      {/* Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={scholarship.image || "/placeholder.png"}
          alt={scholarship.universityName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <h3 className="text-lg font-semibold text-primary truncate">
          {scholarship.scholarshipName}
        </h3>

        <h4 className="text-md font-medium text-secondary truncate">
          {scholarship.universityName}
        </h4>

        <p className="text-sm text-secondary truncate">
          {scholarship.country}, {scholarship.city || ""}
        </p>

        {scholarship.applicationFees && (
          <p className="text-sm text-primary font-medium truncate">
            Application Fees: ${scholarship.applicationFees}
          </p>
        )}
      </div>

      {/* Button */}
      <div className="p-4 pt-0 mt-auto">
        <Link
          to={`/scholarships/${scholarship._id}`}
          className="block w-full text-center bg-secondary text-white py-2 rounded-tr-2xl rounded-bl-2xl hover:bg-secondary/80 transition duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ScholarshipCard;
