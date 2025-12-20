import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { FiEye, FiEdit2, FiXCircle } from "react-icons/fi";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const ManageApplications = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [searchText, setSearchText] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");
    const [feedbackError, setFeedbackError] = useState("");

    // Fetch all applications
    const { data: applications = [], isLoading } = useQuery({
        queryKey: ["applications", searchText],
        queryFn: async () => {
            const params = new URLSearchParams({ search: searchText }).toString();
            const res = await axiosSecure.get(`/applications/all?${params}`);
            return res.data;
        },
    });

    // Open details modal
    const handleDetails = (application) => {
        setSelectedApplication(application);
        setIsDetailsModalOpen(true);
    };

    // Open feedback modal
    const handleFeedback = (application) => {
        setSelectedApplication(application);
        setFeedbackText(application.feedback || "");
        setIsFeedbackModalOpen(true);
    };

    const submitFeedback = async () => {
        try {
            await axiosSecure.patch(`/applications/${selectedApplication._id}/feedback`, {
                feedback: feedbackText,
            });
            Swal.fire("Success", "Feedback submitted!", "success");
            setIsFeedbackModalOpen(false);
            queryClient.invalidateQueries(["applications"]);
        } catch (err) {
            Swal.fire("Error", "Failed to submit feedback.", "error");
        }
    };

    // Update application status
    const updateStatus = async (application, status) => {
        try {
            await axiosSecure.patch(`/applications/${application._id}/status`, { status });
            Swal.fire("Success", `Status updated to ${status}!`, "success");
            queryClient.invalidateQueries(["applications"]);
        } catch (err) {
            Swal.fire("Error", "Failed to update status.", "error");
        }
    };

    // Cancel application
    const handleCancel = async (application) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will reject the application.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, reject it!",
        });

        if (confirm.isConfirmed) {
            await updateStatus(application, "rejected");
        }
    };

    return (
        <div className="w-full p-6 bg-white shadow-lg border border-secondary/50 rounded-tr-2xl rounded-bl-2xl">
            <h2 className="text-xl md:text-2xl lg:text-3xl text-primary font-semibold mb-6">
                Manage Applications ({applications.length})
            </h2>

            <input
                type="text"
                placeholder="Search by Applicant or University"
                className="input w-full max-w-xs mb-4 outline-none border-secondary/50 rounded-bl-2xl rounded-tr-2xl"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />

            <div className="overflow-x-auto border border-secondary rounded-bl-2xl rounded-tr-2xl">
                <table className="table w-full text-sm">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th className="text-center">#</th>
                            <th className="text-center">Applicant Name</th>
                            <th className="text-center">Applicant Email</th>
                            <th className="text-center">University</th>
                            <th className="text-center">Feedback</th>
                            <th className="text-center">Application Status</th>
                            <th className="text-center">Payment Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan="8" className="text-center py-10 text-primary">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {!isLoading && applications.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-10 text-primary opacity-70">
                                    No applications found.
                                </td>
                            </tr>
                        )}

                        {applications.map((app, index) => (
                            <tr key={app._id} className="hover:bg-gray-50">
                                <td className="text-center text-primary">{index + 1}</td>
                                <td className="text-center text-primary">{app.userName}</td>
                                <td className="text-center text-primary">{app.userEmail}</td>
                                <td className="text-center text-primary">{app.universityName}</td>
                                <td className="text-center text-primary max-w-[200px] truncate">{app.feedback || "-"}</td>
                                <td className={`text-center ${app.applicationStatus === "completed" ? "text-green-500" : app.applicationStatus === "rejected" ? "text-red-500" : app.applicationStatus === "processing" ? "text-primary" : "text-secondary"} font-medium`}>{app.applicationStatus}</td>
                                <td
                                    className={`text-center font-semibold ${app.paymentStatus === "paid" ? "text-primary" : "text-secondary"
                                        }`}
                                >
                                    {app.paymentStatus}
                                </td>

                                <td className="text-center">
                                    <div className="inline-flex gap-3 items-center justify-center">
                                        <button
                                            title="Details"
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => handleDetails(app)}
                                        >
                                            <FiEye size={18} />
                                        </button>

                                        <button
                                            title="Feedback"
                                            className="text-green-600 hover:text-green-800"
                                            onClick={() => handleFeedback(app)}
                                        >
                                            <FiEdit2 size={18} />
                                        </button>

                                        <select
                                            className="select select-bordered rounded-bl-2xl rounded-tr-2xl select-sm min-w-[100px]"
                                            value={app.applicationStatus}
                                            onChange={(e) => updateStatus(app, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="completed">Completed</option>
                                        </select>

                                        {
                                            app.applicationStatus !== "rejected" &&
                                            <button
                                                title="Cancel"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleCancel(app)}
                                            >
                                                <FiXCircle size={18} />
                                            </button>
                                        }
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            {isDetailsModalOpen && selectedApplication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-bl-2xl rounded-tr-2xl border border-primary/30 shadow-xl p-6">
                        <button
                            onClick={() => setIsDetailsModalOpen(false)}
                            className="absolute top-3 right-3 text-primary hover:text-red-500"
                        >
                            <IoClose size={28} />
                        </button>
                        <h3 className="text-xl font-semibold text-primary mb-4">Application Details</h3>
                        <div className="space-y-2">
                            <p><strong>Applicant Name:</strong> {selectedApplication.userName}</p>
                            <p><strong>Email:</strong> {selectedApplication.userEmail}</p>
                            <p><strong>University:</strong> {selectedApplication.universityName}</p>
                            <p><strong>Scholarship:</strong> {selectedApplication.scholarshipName || "-"}</p>
                            <p><strong>Status:</strong> {selectedApplication.applicationStatus}</p>
                            <p><strong>Payment:</strong> {selectedApplication.paymentStatus}</p>
                            <p><strong>Feedback:</strong> {selectedApplication.feedback || "-"}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            {/* Feedback Modal */}
            {isFeedbackModalOpen && selectedApplication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-2xl bg-white rounded-bl-2xl rounded-tr-2xl border border-primary/30 shadow-xl p-6">
                        <button
                            onClick={() => setIsFeedbackModalOpen(false)}
                            className="absolute top-3 right-3 text-primary hover:text-red-500"
                        >
                            <IoClose size={28} />
                        </button>
                        <h3 className="text-xl font-semibold text-primary mb-4">
                            Give Feedback for {selectedApplication.userName}
                        </h3>

                        <textarea
                            className="textarea outline-none w-full border-secondary/50 rounded-bl-2xl rounded-tr-2xl mb-1"
                            rows={5}
                            placeholder="Enter feedback (max 200 characters)"
                            value={feedbackText}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 200) {
                                    setFeedbackText(value);
                                    setFeedbackError("");
                                } else {
                                    setFeedbackError("Feedback cannot exceed 200 characters");
                                }
                            }}
                        ></textarea>
                        {feedbackError && (
                            <p className="text-red-500 text-sm mt-1">{feedbackError}</p>
                        )}
                        <p className="text-gray-500 text-sm mt-1">{feedbackText.length}/200</p>

                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-bl-2xl rounded-tr-2xl"
                                onClick={() => setIsFeedbackModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-bl-2xl rounded-tr-2xl"
                                onClick={submitFeedback}
                                disabled={feedbackText.length > 200}
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageApplications;
