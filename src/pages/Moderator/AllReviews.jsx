import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FiXCircle } from "react-icons/fi";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Rating } from "@smastrom/react-rating";
import LoadingData from "../../components/Loading/LoadingData";

const AllReviews = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [searchText, setSearchText] = useState("");

    // Fetch all reviews
    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ["reviews", searchText],
        queryFn: async () => {
            const params = new URLSearchParams({ search: searchText }).toString();
            const res = await axiosSecure.get(`/reviews/all?${params}`);
            return res.data;
        },
    });

    // Delete review
    const handleDelete = async (review) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This review will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axiosSecure.delete(`/reviews/${review._id}`);
                Swal.fire("Deleted!", "Review removed successfully.", "success");
                queryClient.invalidateQueries(["reviews"]);
            } catch (err) {
                Swal.fire("Error", "Failed to delete review.", "error");
            }
        }
    };

    return (
        <div className="w-full p-6 bg-white shadow-lg border border-secondary/50 rounded-tr-2xl rounded-bl-2xl">
            <h2 className="text-2xl text-primary font-semibold mb-6">
                All Reviews ({reviews.length})
            </h2>

            <input
                type="text"
                placeholder="Search by student / university / comment"
                className="input outline-none w-full max-w-xs mb-4 border-secondary/50 rounded-bl-2xl rounded-tr-2xl"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />

            <div className="overflow-x-auto border border-secondary rounded-bl-2xl rounded-tr-2xl">
                <table className="table w-full text-sm">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th className="text-center">#</th>
                            <th className="text-center">Student</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Scholarship Name</th>
                            <th className="text-center">University</th>
                            <th className="text-center">Rating</th>
                            <th className="text-center">Comment</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan="7" className="text-center -mt-10 text-primary">
                                   <LoadingData></LoadingData>
                                </td>
                            </tr>
                        )}

                        {!isLoading && reviews.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-10 opacity-70">
                                    No reviews found.
                                </td>
                            </tr>
                        )}

                        {reviews.map((review, index) => (
                            <tr key={review._id} className="hover:bg-gray-50">
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{review.userName}</td>
                                <td className="text-center">{review.userEmail}</td>
                                <td className="text-center">{review.scholarshipName}</td>
                                <td className="text-center">{review.universityName}</td>
                                <td className="text-center">
                                    <div className="flex justify-center">
                                        <Rating
                                            style={{ minWidth: 80, maxWidth: 120, width: "100%" }} // maxWidth control + responsive
                                            value={review.ratingPoint}
                                            readOnly
                                        />
                                    </div>
                                </td>

                                <td className="text-center max-w-xs truncate">
                                    {review.reviewComment}
                                </td>
                                <td className="text-center">
                                    <button
                                        title="Delete Review"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDelete(review)}
                                    >
                                        <FiXCircle size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default AllReviews;
