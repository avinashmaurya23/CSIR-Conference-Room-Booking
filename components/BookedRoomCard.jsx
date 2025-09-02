import React from "react";
import Link from "next/link";
import CancelBookingButton from "@/components/CancelBookingButton";
import { DateTime } from "luxon";

// Helper function using Luxon for cleaner, more reliable date formatting.
const formatDate = (dateString) => {
  return DateTime.fromISO(dateString, { zone: "utc" }).toFormat(
    "MMM d 'at' h:mm a"
  );
};

// A small component for the color-coded status badge.
const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

function BookedRoomCard({ booking }) {
  const { room_id: room } = booking;
  console.log(booking.booking_status);
  const isCancellable =
    booking.booking_status === "Pending" ||
    booking.booking_status === "Confirm";

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

          {/* Cancel button only shows if the booking is 'pending' or 'confirmed' */}
          {isCancellable && <CancelBookingButton bookingId={booking.$id} />}
        </div>
      </div>
    </div>
  );
}

export default BookedRoomCard;
