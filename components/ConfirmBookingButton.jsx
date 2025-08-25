"use client";
import confirmBooking from "@/app/actions/confirmBooking";
import { toast } from "react-toastify";

const ConfirmBookingButton = ({ bookingId }) => {
  const handleConfirmClick = async () => {
    if (!confirm("Are you sure you want to Confirm this booking?")) {
      return;
    }

    try {
      const result = await confirmBooking(bookingId);
      if (result.success) {
        toast.success("Booking Confirm successfully");
      }
    } catch (error) {
      console.log("Error Confirm booking:", error);
      return {
        error: "Failed to Confirm booking. Please try again later.",
      };
    }
  };

  return (
    <button
      onClick={handleConfirmClick}
      className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700"
    >
      Confirm
    </button>
  );
};
export default ConfirmBookingButton;
