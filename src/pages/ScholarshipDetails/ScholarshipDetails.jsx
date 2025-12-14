import React from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { 
  FaUniversity, 
  FaMapMarkerAlt, 
  FaGraduationCap, 
  FaClock, 
  FaDollarSign, 
  FaAward
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";


const ScholarshipDetailsPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch scholarship details
  const { data: scholarship, isLoading } = useQuery({
    queryKey: ["singleScholarship", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/scholarships/${id}`);
      return res.data;
    },
  });

  // Check if the logged-in user already applied
  const { data: application, isLoading: appLoading } = useQuery({
    queryKey: ["userApplication", id, user?.email],
    enabled: !!user?.email && !!scholarship,
    queryFn: async () => {
      const res = await axiosSecure.get(`/applications/check?scholarshipId=${id}&userEmail=${user.email}`);
      return res.data; // returns the application if exists, null if not
    },
  });

  if (isLoading || appLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!scholarship) return <p className="text-center mt-10 text-red-500">Scholarship not found.</p>;

  return (
    <div className="w-11/12 mx-auto py-12 space-y-10">

      {/* Hero Section */}
      <div className="relative w-full rounded-bl-2xl rounded-tr-2xl overflow-hidden shadow-lg border border-secondary/20">
        <img
          src={scholarship.image || "/placeholder.png"}
          alt={scholarship.universityName}
          className="w-full h-72 md:h-96 object-cover filter brightness-75"
        />

        {/* Deadline */}
        <div className="absolute top-4 right-4 flex flex-col items-start gap-1 z-20">
          <div className="bg-red-600 text-white font-bold px-3 py-1 rounded-bl-2xl rounded-tr-2xl flex items-center gap-2 shadow-lg text-sm md:text-base lg:text-lg">
            <FaClock />
            <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</span>
          </div>
        </div>

        {/* Labels and Scholarship Name */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/40 to-transparent">
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4 break-words">
            {scholarship.scholarshipName}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-primary text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-bl-2xl rounded-tr-2xl">
              {scholarship.scholarshipCategory}
            </span>
            <span className="bg-secondary text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-bl-2xl rounded-tr-2xl">
              {scholarship.degree}
            </span>
            <span className="bg-accent text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-bl-2xl rounded-tr-2xl">
              {scholarship.subjectCategory}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {scholarship.description && (
        <div className="p-6 rounded-bl-2xl rounded-tr-2xl border border-secondary/20">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-primary mb-4 flex items-center gap-2">
            <FaGraduationCap /> Scholarship Description
          </h2>
          <p className="text-gray-700 text-xs sm:text-sm md:text-base lg:text-base leading-relaxed">
            {scholarship.description}
          </p>
        </div>
      )}

      {/* Right Column: Info + Coverage + Fees */}
      <div className="space-y-6">
        {/* General Info */}
        <div className="p-6 rounded-bl-2xl rounded-tr-2xl border border-secondary/20 space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <FaUniversity className="text-primary text-base sm:text-xl" />
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-secondary">{scholarship.universityName}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <FaAward className="text-primary text-base sm:text-xl" />
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-secondary">World Rank: {scholarship.worldRank || "N/A"}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <FaMapMarkerAlt className="text-primary text-base sm:text-xl" />
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-secondary">{scholarship.country}, {scholarship.city || ""}</p>
          </div>
        </div>

        {/* Scholarship Coverage */}
        <div className="bg-accent p-6 text-center rounded-bl-2xl rounded-tr-2xl shadow-md border border-secondary/20 space-y-3">
          <span className="text-sm sm:text-sm md:text-base text-white font-medium">Scholarship Coverage</span>
          <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white mt-1 block">
            ${scholarship.totalAmount || 0}
          </span>
          <span className="text-xs sm:text-sm md:text-base text-white block mt-1">
            Total amount student will receive if granted
          </span>
        </div>

        {/* Application Fee + Service Charge + Apply Button */}
        <div className="bg-white p-6 rounded-bl-2xl rounded-tr-2xl shadow-md border border-secondary/20 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm md:text-base text-secondary font-medium">Application Fees</span>
              <span className="text-lg sm:text-xl md:text-xl font-semibold text-primary">${scholarship.applicationFees || 0}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm md:text-base text-secondary font-medium">Service Charge</span>
              <span className="text-lg sm:text-xl md:text-xl font-semibold text-primary">${scholarship.serviceCharge || 0}</span>
            </div>
          </div>

          {/* Conditional Apply Button */}
          {application ? (
            <Link
              to='/dashboard/my-applications'
              className="bg-gray-500 hover:bg-gray-600 text-white px-10 py-3 rounded-tr-2xl rounded-bl-2xl font-semibold mt-4 transition duration-300 text-sm sm:text-base md:text-lg text-center"
            >
              Already Applied - View Application
            </Link>
          ) : (
            <Link
              to={`/dashboard/payment/${scholarship._id}`}
              className="bg-secondary hover:bg-secondary/80 text-white px-10 py-3 rounded-tr-2xl rounded-bl-2xl font-semibold mt-4 transition duration-300 text-sm sm:text-base md:text-lg"
            >
              Apply for Scholarship
            </Link>
          )}
        </div>

        {/* Stipend / Additional Coverage */}
        {scholarship.stipend && (
          <div className="bg-white p-6 rounded-bl-2xl rounded-tr-2xl shadow-md border border-secondary/20">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-primary mb-4 flex items-center gap-2">
              <FaDollarSign /> Stipend / Additional Coverage
            </h2>
            <p className="text-gray-700 text-xs sm:text-sm md:text-base lg:text-base leading-relaxed">{scholarship.stipend}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipDetailsPage;
