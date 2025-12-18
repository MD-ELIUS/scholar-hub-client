import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEye, FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

// ✅ Import the Rating component and its CSS
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { MdReviews } from "react-icons/md";
import LoadingData from "../../components/Loading/LoadingData";

const MyApplications = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [searchText, setSearchText] = useState("");
    const [reviewModal, setReviewModal] = useState({ isOpen: false, app: null });
    const [starRating, setStarRating] = useState(0); // ⭐ for star rating

    // 🔹 Fetch user reviews
    const { data: myReviews = [] } = useQuery({
        queryKey: ["myReviews", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/reviews?userEmail=${user.email}`);
            return res.data;
        },
    });

    // 🔹 Helper to check if scholarship is already reviewed
    const isAlreadyReviewed = (scholarshipId) => {
        return myReviews.some(
            (review) =>
                review.scholarshipId === scholarshipId &&
                review.userEmail === user?.email
        );
    };

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ["myApplications", user?.email, searchText],
        enabled: !!user?.email,
        queryFn: async () => {
            const params = new URLSearchParams({
                userEmail: user.email,
                search: searchText,
            }).toString();
            const res = await axiosSecure.get(`/applications?${params}`);
            const apps = res.data;

            const appsWithScholarship = await Promise.all(
                apps.map(async (app) => {
                    if (app.scholarshipId) {
                        try {
                            const scholarshipRes = await axiosSecure.get(
                                `/scholarships/${app.scholarshipId}`
                            );
                            return { ...app, scholarshipData: scholarshipRes.data };
                        } catch (err) {
                            console.error("Failed to fetch scholarship for app:", app._id, err);
                            return { ...app, scholarshipData: {} };
                        }
                    } else {
                        return { ...app, scholarshipData: {} };
                    }
                })
            );

            return appsWithScholarship;
        },
    });

    const handleView = (app) => {
        const sch = app.scholarshipData || {};
        Swal.fire({
            title: sch.scholarshipName || "N/A",
            html: `
        <p><strong>University:</strong> ${sch.universityName || app.universityName || "-"}</p>
        <p><strong>Address:</strong> ${sch.city || app.universityAddress || "-"}</p>
        <p><strong>Degree:</strong> ${sch.degree || app.degree || "-"}</p>
        <p><strong>Subject Category:</strong> ${sch.subjectCategory || app.subjectCategory || "-"}</p>
        <p><strong>Application Fees:</strong> $${app.applicationFees}</p>
        <p><strong>Application Status:</strong> ${app.applicationStatus}</p>
        <p><strong>Payment Status:</strong> ${app.paymentStatus}</p>
        <p><strong>Feedback:</strong> ${app.feedback || "No feedback yet"}</p>
        <p><strong>Deadline:</strong> ${sch.deadline ? new Date(sch.deadline).toLocaleDateString() : "-"}</p>
        <p><strong>Country:</strong> ${sch.country || "-"}</p>
      `,
            icon: "info",
            confirmButtonText: "Close",
        });
    };

    const handleEdit = (app) =>
        Swal.fire("Edit Application", "You can now edit your application.", "info");

    const handleDelete = async (app) => {
        const confirm = await Swal.fire({
            title: `Delete ${app.scholarshipData?.scholarshipName || app.universityName}?`,
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axiosSecure.delete(`/applications/${app._id}`);
                Swal.fire("Deleted!", "Application deleted successfully.", "success");
                queryClient.invalidateQueries(["myApplications", user?.email, searchText]);
            } catch (err) {
                Swal.fire("Error", "Failed to delete application.", "error");
            }
        }
    };

    const handlePay = async (app) => {
        try {
            const res = await axiosSecure.post("/create-checkout-session", {
                scholarshipId: app.scholarshipId,
                userEmail: user.email,
            });
            if (res.data?.url) window.location.href = res.data.url;
        } catch (err) {
            Swal.fire("Error", "Failed to initiate payment.", "error");
        }
    };

    const handleAddReview = (app) => {
        setStarRating(0); // reset star rating
        setReviewModal({ isOpen: true, app });
    };

    const submitReview = async (e) => {
        e.preventDefault();
        const comment = e.target.comment.value;
        const app = reviewModal.app;

        try {
            const res = await axiosSecure.post(`/applications/${app._id}/review`, {
                rating: starRating,
                comment
            });

            if (res.status === 201 || res.status === 200) {
                Swal.fire("Success", "Review submitted!", "success");
                setReviewModal({ isOpen: false, app: null });
                queryClient.invalidateQueries(["myApplications", user?.email, searchText]);
                queryClient.invalidateQueries(["myReviews", user?.email]); // refresh reviews
            }
        } catch (err) {
            if (err.response?.status === 409) {
                Swal.fire("Already Reviewed", "You have already submitted a review for this scholarship.", "info");
                setReviewModal({ isOpen: false, app: null });
            } else {
                Swal.fire("Error", "Failed to submit review.", "error");
            }
        }
    };

  


    return (
        <div className="w-full p-6 bg-white shadow-lg border border-secondary/50 rounded-tr-2xl rounded-bl-2xl">
            <h2 className="text-xl md:text-2xl lg:text-3xl text-primary font-semibold mb-6">
                My Applications ({applications.length})
            </h2>

            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by Scholarship or University"
                    className="input w-full max-w-xs outline-none border-secondary/50 rounded-bl-2xl rounded-tr-2xl"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto border border-secondary rounded-bl-2xl rounded-tr-2xl">
                <table className="table w-full text-sm">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th className="text-center">#</th>
                            <th className="text-center">Scholarship Name</th>
                            <th className="text-center">University Name</th>
                            <th className="text-center">Address</th>
                            <th className="text-center">Feedback</th>
                            <th className="text-center">Subject Category</th>
                            <th className="text-center">Application Fees</th>
                            <th className="text-center">Application Status</th>
                            <th className="text-center">Payment Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan="9" className="text-center py-10 text-primary">
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {!isLoading && applications.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center py-10 text-primary opacity-70">
                                    No applications found.
                                </td>
                            </tr>
                        )}

                        {applications.map((app, index) => {
                            const sch = app.scholarshipData || {};
                            return (
                                <tr key={app._id} className="hover:bg-gray-50">
                                    <td className="text-center text-primary">{index + 1}</td>
                                    <td className="text-center text-primary font-semibold">{sch.scholarshipName  || app.scholarshipName}</td>
                                    <td className="text-center text-primary font-semibold">{sch.universityName || app.universityName}</td>
                                    <td className="text-center text-primary">{sch.country || app.country}</td>
                                    <td className="text-center text-primary">{app.feedback || "-"}</td>
                                    <td className="text-center text-primary">{sch.subjectCategory || app.subjectCategory}</td>
                                    <td className="text-center text-primary">${app.applicationFees}</td>
                                    <td className={`text-center ${app.applicationStatus === "completed" ?  "text-green-500" : app.applicationStatus === "rejected" ? "text-red-500" : app.applicationStatus === "processing" ? "text-primary" :  "text-secondary" } font-medium`}>{app.applicationStatus}</td>
                                    <td className="text-center">
                                        {app.paymentStatus === "paid" ? (
                                            <span className="text-center font-semibold text-green-500 ">
                                                {app.paymentStatus}
                                            </span>
                                        ) : (
                                            <button className=" btn btn-secondary btn-outline  rounded-bl-2xl rounded-tr-2xl px-2 py-1  text-sm font-semibold" onClick={() => handlePay(app)}>
                                                Pay
                                            </button>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        <div className="inline-flex gap-2 justify-center items-center">
                                            <button className="text-secondary hover:text-primary" onClick={() => handleView(app)}>
                                                <FaEye size={18} />
                                            </button>

                                            {app.applicationStatus === "pending" && (
                                                <>
                                                    <button className="text-blue-500 hover:text-primary" onClick={() => handleEdit(app)}>
                                                        <FaEdit size={18} />
                                                    </button>

                                                  

                                                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(app)}>
                                                        <RiDeleteBin6Line size={18} />
                                                    </button>
                                                </>
                                            )}


                                             {app.applicationStatus === "rejected" && (
                                                <>
                                                    

                                                    {app.paymentStatus === "unpaid" && (
                                                        <button className=" btn btn-secondary btn-outline  rounded-bl-2xl rounded-tr-2xl text-sm font-semibold" onClick={() => handlePay(app)}>
                                                            Pay
                                                        </button>
                                                    )}

                                                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(app)}>
                                                        <RiDeleteBin6Line size={18} />
                                                    </button>
                                                </>
                                            )}


                                       
                                            {app.applicationStatus === "completed" && (
                                                isAlreadyReviewed(app.scholarshipId) ? (
                                                    <span className="text-green-500 font-semibold">
                                                        Already Reviewed
                                                    </span>
                                                ) : (
                                                    <button className=" text-blue-500 hover:text-primary text-sm font-semibold" onClick={() => handleAddReview(app)}>
                                                        <MdReviews size={24} />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {reviewModal.isOpen && reviewModal.app && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-lg bg-white rounded-bl-2xl rounded-tr-2xl border border-primary/30 shadow-xl p-6">
                        <h3 className="text-xl font-semibold text-primary mb-4">
                            Add Review: {reviewModal.app.scholarshipData?.scholarshipName || reviewModal.app.universityName}
                        </h3>
                        <form onSubmit={submitReview} className="space-y-4">
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
                                <textarea name="comment" rows="4" required className="textarea w-full border-secondary/50 rounded-lg"></textarea>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={() => setReviewModal({ isOpen: false, app: null })}>
                                    Cancel
                                </button>
                                <button type="submit" className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg">Submit Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyApplications;
