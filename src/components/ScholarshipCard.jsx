import React from "react";
import { Link } from "react-router";

const ScholarshipCard = ({ scholarship }) => {
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

        {/* SCHOLARSHIP NAME → TOP */}
        <h3 className="text-lg font-semibold text-primary truncate">
          {scholarship.scholarshipName}
        </h3>

        {/* UNIVERSITY NAME → BELOW */}
        <h4 className="text-md font-medium text-secondary truncate">
          {scholarship.universityName}
        </h4>

        {/* LOCATION */}
        <p className="text-sm text-secondary truncate">
          {scholarship.country}, {scholarship.city || ""}
        </p>

        {/* FEES */}
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
