import React from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    Swal.fire('Payment Cancelled', 'Your payment was not completed.', 'info');
  }, []);

  return (
    <div className="w-11/12 md:w-1/2 mx-auto py-12 text-center space-y-6">
      <h2 className="text-3xl font-bold text-red-600">Payment Cancelled</h2>
      <p className="text-lg text-gray-700">
        You have cancelled the payment process. Your scholarship application is not submitted.
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

export default PaymentCancelled;
