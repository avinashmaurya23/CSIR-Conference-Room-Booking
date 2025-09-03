"use client";
import deleteBooking from "@/app/actions/deleteBooking";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const DeleteBookingButton = ({ bookingId }) => {
  const handleConfirmClick = async () => {
    if (!confirm("Are you sure you want to Delete this booking?")) {
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
      className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-600 shadow-md hover:from-red-600 hover:to-rose-700 hover:shadow-lg active:scale-95 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
    >
      <span>Delete Booking</span>
      <FaTrash />
    </button>
  );
};
export default DeleteBookingButton;
