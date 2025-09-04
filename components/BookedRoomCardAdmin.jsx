import React from "react";
import Link from "next/link";
import RejectBookingButton from "@/components/RejectBookingButton";
import ConfirmBookingButton from "./ConfirmBookingButton";
import DeleteBookingButton from "./DeleteBookingButton";

// Helper function moved outside the component to prevent re-creation on every render.
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC",
  };
  return new Intl.DateTimeFormat("en-US", options)
    .format(date)
    .replace(",", " at");
};

// A small component for the color-coded status badge.
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Confirm: "bg-green-100 text-green-800",
    Declined: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

function BookedRoomCardAdmin({ booking }) {
  const { room_id: room } = booking;

  return (
    <div className="bg-white shadow-md border border-gray-200 hover:shadow-lg transition-shadow mx-4 xl:mx-auto max-w-7xl rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      {/* Left Side: Booking Details */}
      <div className="space-y-1">
        <h4 className="text-lg font-semibold text-gray-900">{room.name}</h4>
        <p className="text-sm text-gray-600">
          <strong>Check In:</strong> {formatDate(booking.check_in)}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Check Out:</strong> {formatDate(booking.check_out)}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Booked By:</strong> {booking.user_name}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Event:</strong> {booking.event_name}
        </p>
      </div>

      {/* Right Side: Status and Actions */}
      <div className="flex flex-col items-start sm:items-end w-full sm:w-auto mt-4 sm:mt-0">
        <div className="mb-3">
          <StatusBadge status={booking.booking_status} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full sm:w-auto">
          <Link
            href={`/rooms/${room.$id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Room
          </Link>

          {/* Buttons only show if the booking is 'pending' */}
          {booking.booking_status === "Pending" && (
            <>
              <ConfirmBookingButton bookingId={booking.$id} />
              <RejectBookingButton bookingId={booking.$id} />
            </>
          )}
          {booking.booking_status === "Confirm" && (
            <>
              <RejectBookingButton bookingId={booking.$id} />
            </>
          )}
          {booking.booking_status === "Declined" && (
            <>
              <DeleteBookingButton bookingId={booking.$id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookedRoomCardAdmin;
