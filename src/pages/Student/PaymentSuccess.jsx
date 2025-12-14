import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const confirmPayment = async () => {
      try {
        const res = await axiosSecure.post('/payment-success', { sessionId });

        if (res.data?.success) {
          Swal.fire('Payment Successful', 'Your scholarship application is confirmed!', 'success');
        } else {
          Swal.fire('Payment Failed', 'Something went wrong. Please contact support.', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Payment confirmation failed!', 'error');
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-dashed rounded-full border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-11/12 md:w-1/2 mx-auto py-12 text-center space-y-6">
      <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
      <p className="text-lg text-gray-700">
        Thank you for applying. Your scholarship application has been submitted successfully.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-secondary hover:bg-secondary/80 text-white px-6 py-3 rounded-xl font-semibold transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccess;
