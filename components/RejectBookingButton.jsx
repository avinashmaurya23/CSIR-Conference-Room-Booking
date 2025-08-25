"use client";
import confirmBooking from "@/app/actions/confirmBooking";
import rejectBooking from "@/app/actions/rejectBooking";
import { toast } from "react-toastify";

const RejectBookingButton = ({ bookingId }) => {
  const handleCancelClick = async () => {
    if (!confirm("Are you sure you want to reject this booking?")) {
      return;
    }

    try {
      const result = await rejectBooking(bookingId);
      if (result.success) {
        toast.success("Booking rejected successfully");
      }
    } catch (error) {
      console.log("Error cancelling booking:", error);
      return {
        error: "Failed to cancel booking. Please try again later.",
      };
    }
  };

  return (
    <button
      onClick={handleCancelClick}
      className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700"
    >
      Reject
    </button>
  );
};
export default RejectBookingButton;
