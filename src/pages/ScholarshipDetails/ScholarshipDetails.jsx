import React from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FaUniversity,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaClock,
  FaDollarSign,
  FaAward,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaQuoteLeft
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import axios from "axios";
import useTitle from "../../hooks/useTitle";

const ScholarshipDetailsPage = () => {
  useTitle("Scholarship Details");
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();
  const { role } = useRole();

  //  Scholarship details fetch
  const { data: scholarship, isLoading, error, isFetching } = useQuery({
    queryKey: ["singleScholarship", id],
    // Wait for user to be authenticated AND token to exist
    enabled: !!id && !!user && !!localStorage.getItem("token"),
    queryFn: async () => {
      const res = await axiosSecure.get(`/scholarships/${id}`);
      return res.data;
    },
    retry: false, // Don't retry on auth failures
    refetchOnMount: true, // Refetch when component mounts (after login redirect)
  });

  // ২. Application check
  const { data: application, isLoading: appLoading } = useQuery({
    queryKey: ["userApplication", id, user?.email],
    // Only run when user is authenticated, scholarship loaded, and token exists
    enabled: !!user?.email && !!scholarship && !!localStorage.getItem("token"),
    queryFn: async () => {
      const res = await axiosSecure.get(`/applications/check?scholarshipId=${id}&userEmail=${user.email}`);
      return res.data;
    },
    retry: false, // Don't retry on auth failures
  });

  // Fetch Reviews (this doesn't need auth, use regular axios)
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", scholarship?.scholarshipName],
    // Only scholarship name is needed for reviews
    enabled: !!scholarship?.scholarshipName,
    queryFn: async () => {
      const res = await axios.get(`https://scholar-hub-server-phi.vercel.app/reviews/all?search=${encodeURIComponent(scholarship.scholarshipName)}`);
      return res.data;
    },
  });

  const scrollToApply = () => {
    const applySection = document.getElementById("apply-card");
    if (applySection) {
      applySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (authLoading || isLoading || appLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Check if query should be enabled
  const queryIsEnabled = !!id && !!user && !!localStorage.getItem("token");

  // Only show "Not Found" if:
  // 1. Query is enabled (user is authenticated)
  // 2. Query has finished loading
  // 3. Still no data
  if (!scholarship && queryIsEnabled && !isLoading && !isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-gray-400">Scholarship Not Found</h2>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  // If query is not enabled yet (waiting for auth), keep showing loading
  if (!scholarship) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const {
    universityName,
    scholarshipName,
    scholarshipCategory,
    degree,
    subjectCategory,
    deadline,
    image,
    description,
    worldRank,
    country,
    city,
    totalAmount,
    applicationFees,
    serviceCharge,
    stipend,
  } = scholarship;

  // Format date
  const formattedDeadline = new Date(deadline).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return (
    <div className=" min-h-screen">

      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={image || "/placeholder.png"}
          alt={universityName}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 z-20 container mx-auto px-4 flex flex-col justify-end pb-12">
          {/* Breadcrumbs / Badges */}
          <div className="flex flex-wrap gap-2 mb-4 animate-fade-in-up">
            <span className="badge badge-primary badge-lg border-none text-white py-2 px-2 md:py-4 md:px-4 font-semibold shadow-lg rounded-bl-2xl rounded-tr-2xl text-xs sm:text-sm md:text-base">
              {scholarshipCategory}
            </span>
            <span className="badge badge-secondary badge-lg border-none text-white py-2 px-2 md:py-4 md:px-4 font-semibold shadow-lg rounded-bl-2xl rounded-tr-2xl text-xs sm:text-sm md:text-base">
              {degree}
            </span>
            <span className="badge bg-accent text-white border-none badge-lg py-2 px-2 md:py-4 md:px-4 font-semibold shadow-lg rounded-bl-2xl rounded-tr-2xl text-xs sm:text-sm md:text-base">
              {subjectCategory}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-lg max-w-4xl">
            {scholarshipName}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center text-gray-200 gap-2 text-sm sm:text-base md:text-lg font-medium">
            <div className="flex gap-1 items-center">
              <FaUniversity className="text-secondary" />
              <span>{universityName}</span>
            </div>
            <span className="mx-2 hidden md:flex">•</span>
            <div className="flex gap-1 items-center">
              <FaMapMarkerAlt className="text-secondary" />
              <span>{country}, {city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 -mt-10 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Details (2 spans) */}
          <div className="lg:col-span-2 space-y-8 text-black">

            {/* Description Card */}
            <div className="bg-white rounded-bl-2xl rounded-tr-2xl shadow-xl p-6 sm:p-8 border-t-4 border-secondary border animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <FaGraduationCap className="text-2xl sm:text-3xl" />
                About this Scholarship
              </h2>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Stipend / Benefits Info */}
            {stipend && (
              <div className="bg-white rounded-bl-2xl rounded-tr-2xl shadow-xl p-6 sm:p-8 border-l-4 border-secondary">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaDollarSign className="text-secondary text-xl sm:text-2xl" />
                  Stipend & Benefits
                </h3>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                  {stipend}
                </p>
              </div>
            )}

            {/* Additional Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-secondary p-6 rounded-bl-2xl rounded-tr-2xl shadow-md flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <FaAward size={24} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase">World Rank</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-800">#{worldRank || "N/A"}</p>
                </div>
              </div>

              <div className="bg-white border border-secondary p-6 rounded-bl-2xl rounded-tr-2xl shadow-md flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-full text-secondary">
                  <FaClock size={24} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase">Deadline</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-800">{formattedDeadline}</p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-8">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <FaQuoteLeft /> Student Reviews
              </h3>

              {reviewsLoading ? (
                <div className="flex justify-center p-10">
                  <span className="loading  loading-dots loading-lg text-primary"></span>
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-white p-6 rounded-bl-2xl rounded-tr-2xl shadow-lg border border-secondary/70 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">

                      {/* Review Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={review.userImage || "https://i.ibb.co/qYWJvVyQ/Bright-Colorful-Young-Man-Avatar.png"} alt={review.userName} onError={(e) => e.target.src = "https://i.ibb.co/qYWJvVyQ/Bright-Colorful-Young-Man-Avatar.png"} />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-base">{review.userName}</h4>
                          <p className="text-xs text-gray-500">{new Date(review.reviewDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 text-secondary mb-3">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.ratingPoint ? "text-secondary" : "text-gray-300"} />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">({review.ratingPoint}.0)</span>
                      </div>

                      {/* Comment */}
                      <p className="text-gray-600 text-sm flex-grow italic">
                        "{review.reviewComment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-10 bg-white rounded-bl-2xl rounded-tr-2xl shadow-sm border border-secondary border-dashed ">
                  <p className="text-gray-500 text-lg">No reviews yet for this scholarship.</p>
                  <p className="text-sm text-gray-400 mt-2">Check back later or apply to be the first!</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sidebar (1 span) */}
          <div className="space-y-6">

            {/* Value / Apply Card */}
            <div id="apply-card" className="bg-white rounded-bl-2xl rounded-tr-2xl shadow-2xl p-6 sticky top-24 border border-secondary">
              <div className="bg-gradient-to-r from-primary to-teal-800 rounded-bl-2xl rounded-tr-2xl p-6 text-center text-white mb-6 shadow-lg transform -translate-y-10 mx-2">
                <p className="text-xs sm:text-sm font-medium opacity-90 uppercase tracking-wider mb-1">Scholarship Value</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold flex justify-center items-start gap-1">
                  {/* Handle currency symbol display if needed, assumed in amount or generic $ */}
                  <span className="text-xl sm:text-2xl mt-1">$</span>
                  {totalAmount}
                </h3>
              </div>

              <div className="-mt-4 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Application Fee</span>
                  <span className="text-lg sm:text-xl font-bold text-primary">${applicationFees}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Service Charge</span>
                  <span className="text-lg sm:text-xl font-bold text-primary">${serviceCharge}</span>
                </div>

                <div className="pt-4">
                  {role === 'student' && (
                    <>
                      {application ? (
                        <div className="w-full">
                          <div className="bg-green-50 text-green-700 p-4 rounded-bl-2xl rounded-tr-2xl flex items-center justify-center gap-2 mb-4 border border-green-200 text-sm sm:text-base">
                            <FaCheckCircle /> Applied Successfully
                          </div>
                          <Link
                            to='/dashboard/my-applications'
                            className="btn btn-outline btn-primary w-full shadow-none hover:shadow-md transition-shadow rounded-bl-2xl rounded-tr-2xl"
                          >
                            View Application
                          </Link>
                        </div>
                      ) : (
                        <Link
                          to={`/dashboard/payment/${scholarship._id}`}
                          className="btn btn-primary w-full text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-pulse-slow rounded-bl-2xl rounded-tr-2xl"
                        >
                          Apply Now <FaArrowRight />
                        </Link>
                      )}
                    </>
                  )}
                </div>

                <p className="text-xs text-center text-gray-400 mt-4">
                  * Fees are non-refundable once paid.
                </p>
              </div>
            </div>



          </div>

        </div>
      </div>

      {/* Floating Mobile Apply Button */}
      {role === 'student' && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] p-4 lg:hidden z-50 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase">Deadline</span>
            <span className="text-sm font-bold text-primary">{formattedDeadline}</span>
          </div>
          {application ? (
            <button
              onClick={scrollToApply}
              className="btn bg-green-600 hover:bg-green-700 text-white rounded-bl-2xl rounded-tr-2xl shadow-lg px-8 flex items-center gap-2"
            >
              <FaCheckCircle /> Applied
            </button>
          ) : (
            <button
              onClick={scrollToApply}
              className="btn btn-primary rounded-bl-2xl rounded-tr-2xl shadow-lg px-8 text-white"
            >
              Apply Now
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default ScholarshipDetailsPage;
