"use client";
import deleteBooking from "@/app/actions/deleteBooking";
import { toast } from "react-toastify";

const DeleteBookingButton = ({ bookingId }) => {
  const handleConfirmClick = async () => {
    if (!confirm("Are you sure you want to Confirm this booking?")) {
      return;
    }

    try {
      const result = await deleteBooking(bookingId);
      if (result.success) {
        toast.success("Booking Deleted successfully");
      }
    } catch (error) {
      console.log("Error Deleting booking:", error);
      return {
        error: "Failed to Delete booking. Please try again later.",
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
export default DeleteBookingButton;
