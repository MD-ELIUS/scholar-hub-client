import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ScholarshipCard from "../../../../components/ScholarshipCard";


const TopScholarships = () => {
  const axiosSecure= useAxiosSecure();

  // Fetch scholarships
  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ["topScholarships"],
    queryFn: async () => {
      const res = await axiosSecure.get("/scholarships");
      return res.data;
    },
  });

  // Sort → lowest applicationFees first → fallback: latest postDate
  const sortedScholarships = [...scholarships]
    .sort((a, b) => {
      const feeA = Number(a.applicationFees) || 999999;
      const feeB = Number(b.applicationFees) || 999999;

      if (feeA !== feeB) return feeA - feeB; // lowest fee first

      return new Date(b.postDate) - new Date(a.postDate); // newer first
    })
    .slice(0, 8);

  if (isLoading) {
    return (
      <div className="text-center py-16 text-primary text-lg font-semibold">
        Loading top scholarships...
      </div>
    );
  }

  return (
    <div className="w-11/12 my-10 mx-auto ">
      {/* TITLE */}
      <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-10">
        🌟 Top Scholarships for You
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedScholarships.map((item) => (
          <ScholarshipCard key={item._id} scholarship={item} />
        ))}
      </div>
    </div>
  );
};

export default TopScholarships;
