"use client";
import confirmBooking from "@/app/actions/confirmBooking";
import { toast } from "react-toastify";

const ConfirmBookingButton = ({ bookingId }) => {
  const handleCancelClick = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const result = await confirmBooking(bookingId);
      if (result.success) {
        toast.success("Booking cancelled successfully");
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
      Confirm
    </button>
  );
};
export default ConfirmBookingButton;
