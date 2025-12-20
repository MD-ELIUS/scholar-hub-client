import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ScholarshipCard from "../../../../components/ScholarshipCard";
import LoadingData from "../../../../components/Loading/LoadingData";
import { IoSparkles } from "react-icons/io5";
import { Link } from "react-router";

const TopScholarships = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch scholarships
  const { data = {}, isLoading } = useQuery({
    queryKey: ["topScholarships"],
    queryFn: async () => {
      const res = await axiosSecure.get("/scholarships");
      return res.data;
    },
  });


  const { scholarships = [] } = data;

  // Sort → lowest applicationFees first → fallback: latest postDate
  const sortedScholarships = [...scholarships]
    .sort((a, b) => {
      const feeA = Number(a.applicationFees) || 999999;
      const feeB = Number(b.applicationFees) || 999999;

      if (feeA !== feeB) return feeA - feeB; // lowest fee first

      return new Date(b.postDate) - new Date(a.postDate); // newer first
    })
    .slice(0, 8);

  console.log(sortedScholarships)

  return (
    <div className="w-11/12 my-14 mx-auto">
      {/* TITLE */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary flex justify-center items-center gap-3 md:gap-5 text-center mb-8">
        <IoSparkles className="text-secondary" /> Top Scholarships
      </h2>

      {isLoading && <LoadingData />}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedScholarships.map((item) => (
          <ScholarshipCard key={item._id} scholarship={item} />
        ))}
      </div>

      {/* SEE MORE BUTTON */}
      <div className="flex justify-center mt-8">
        <Link
          to="/all-scholarships"
          className="btn btn-secondary btn-outline text-black hover:text-white rounded-tr-2xl rounded-bl-2xl px-6 py-2 font-semibold"
        >
          See More
        </Link>
      </div>
    </div>
  );
};

export default TopScholarships;
