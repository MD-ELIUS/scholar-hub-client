import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const MyReviews = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [reviewModal, setReviewModal] = useState({ isOpen: false, review: null });
    const [starRating, setStarRating] = useState(0);
    const [commentText, setCommentText] = useState("");

    // Fetch reviews by user
    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ["myReviews", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/reviews?userEmail=${user.email}`);
            const reviewsData = res.data;

            // Fetch scholarship details for each review
            const reviewsWithScholarship = await Promise.all(
                reviewsData.map(async (review) => {
                    if (review.scholarshipId) {
                        try {
                            const schRes = await axiosSecure.get(`/scholarships/${review.scholarshipId}`);
                            return { ...review, scholarshipData: schRes.data };
                        } catch (err) {
                            return { ...review, scholarshipData: {} };
                        }
                    }
                    return { ...review, scholarshipData: {} };
                })
            );

            return reviewsWithScholarship;
        },
    });

    const handleEdit = (review) => {
        setStarRating(review.ratingPoint);
        setCommentText(review.reviewComment);
        setReviewModal({ isOpen: true, review });
    };

    const submitReview = async (e) => {
        e.preventDefault();
        const review = reviewModal.review;

        try {
            const res = await axiosSecure.put(`/reviews/${review._id}`, {
                ratingPoint: starRating,
                reviewComment: commentText,
            });

            if (res.status === 200 || res.status === 201) {
                Swal.fire("Success", "Review updated!", "success");
                setReviewModal({ isOpen: false, review: null });
                queryClient.invalidateQueries(["myReviews", user?.email]);
            }
        } catch {
            Swal.fire("Error", "Failed to update review.", "error");
        }
    };

    const handleDelete = async (review) => {
        const confirm = await Swal.fire({
            title: `Delete review for ${review.scholarshipData?.scholarshipName || "this scholarship"}?`,
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axiosSecure.delete(`/reviews/${review._id}`);
                Swal.fire("Deleted!", "Review deleted successfully.", "success");
                queryClient.invalidateQueries(["myReviews", user?.email]);
            } catch {
                Swal.fire("Error", "Failed to delete review.", "error");
            }
        }
    };

    return (
        <div className="w-full p-6 bg-white shadow-lg border border-secondary/50 rounded-tr-2xl rounded-bl-2xl">
            <h2 className="text-xl md:text-2xl lg:text-3xl text-primary font-semibold mb-6">
                My Reviews ({reviews.length})
            </h2>

            <div className="overflow-x-auto border border-secondary rounded-bl-2xl rounded-tr-2xl">
                <table className="table w-full text-sm">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th className="text-center">#</th>
                            <th className="text-center">Scholarship Name</th>
                            <th className="text-center">University Name</th>
                            <th className="text-center">Review Comment</th>
                            <th className="text-center">Review Date</th>
                            <th className="text-center">Rating</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan="7" className="text-center py-10 text-primary">
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {!isLoading && reviews.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-10 text-primary opacity-70">
                                    No reviews found.
                                </td>
                            </tr>
                        )}

                        {reviews.map((review, index) => {
                            const sch = review.scholarshipData || {};
                            return (
                                <tr key={review._id} className="hover:bg-gray-50">
                                    <td className="text-center text-primary">{index + 1}</td>
                                    <td className="text-center text-primary font-semibold">{sch.scholarshipName || "-"}</td>
                                    <td className="text-center text-primary">{sch.universityName || "-"}</td>
                                    <td className="text-center text-primary max-w-[200px] truncate">{review.reviewComment}</td>
                                    <td className="text-center text-primary">{new Date(review.reviewDate).toLocaleDateString()}</td>
                                    <td className="text-center">
                                        <Rating style={{ maxWidth: 100 }} value={review.ratingPoint} readOnly />
                                    </td>

                                    <td className="text-center">
                                        <div className="inline-flex gap-2 justify-center items-center">
                                            <button className="text-blue-600 hover:text-primary" onClick={() => handleEdit(review)}>
                                                <FaEdit size={18} />
                                            </button>
                                            <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(review)}>
                                                <RiDeleteBin6Line size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {reviewModal.isOpen && reviewModal.review && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-lg bg-white rounded-bl-2xl rounded-tr-2xl border border-primary/30 shadow-xl p-6">
                        <h3 className="text-xl font-semibold text-primary mb-4">
                            Edit Review: {reviewModal.review.scholarshipData?.scholarshipName || "-"}
                        </h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (starRating === 0) {
                                    Swal.fire("Error", "Rating is required.", "error");
                                    return;
                                }
                                if (commentText.length > 200) {
                                    Swal.fire("Error", "Comment cannot exceed 200 characters.", "error");
                                    return;
                                }
                                submitReview(e);
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block font-medium mb-1">Rating</label>
                                <Rating
                                    style={{ maxWidth: 200 }}
                                    value={starRating}
                                    onChange={setStarRating}
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Comment</label>
                                <textarea
                                    name="comment"
                                    rows="4"
                                    required
                                    className="textarea w-full border-secondary/50 rounded-lg"
                                    value={commentText}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 200) setCommentText(value);
                                    }}
                                    placeholder="Enter your comment (max 200 characters)"
                                ></textarea>
                                <p className="text-gray-500 text-sm mt-1">{commentText.length}/200</p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                                    onClick={() => setReviewModal({ isOpen: false, review: null })}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg"
                                >
                                    Update Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MyReviews;
