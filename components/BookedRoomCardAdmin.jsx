import React from "react";
import Link from "next/link";
import RejectBookingButton from "@/components/RejectBookingButton";
import ConfirmBookingButton from "./ConfirmBookingButton";

function BookedRoomCardAdmin({ booking }) {
  const { room_id: room } = booking;
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    //get month
    const options = { month: "short" };
    const month = date.toLocaleString("en-US", options, { timeZone: "UTC" });

    //get day
    const day = date.getUTCDate();

    //Format time in UTC 12-hour format
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "UTC",
    };
    const time = date.toLocaleTimeString("en-US", timeOptions);

    //Final formatted string
    return `${month} ${day} at  ${time}`;
  };
  // bg-white shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center
  return (
    <div className="bg-white shadow hover:shadow-md  mx-4 xl:mx-auto max-w-7xl rounded-lg p-4 mt-4   flex flex-col sm:flex-row justify-between  sm:items-center">
      <div>
        <h4 className="text-lg font-semibold">{room.name}</h4>
        <p className="text-sm text-gray-600">
          <strong>Check In:</strong> {formatDate(booking.check_in)}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Check Out:</strong> {formatDate(booking.check_out)}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Booking Person:</strong> {booking.user_name}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Event Name: </strong> {booking.event_name}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0">
        <h4 className="text-lg font-semibold text-black">
          Booking Status:{booking.booking_status}
        </h4>
        <Link
          href={`/rooms/${room.$id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700"
        >
          View Room
        </Link>
        <ConfirmBookingButton bookingId={booking.$id} />
        <RejectBookingButton bookingId={booking.$id} />
      </div>
    </div>
  );
}

export default BookedRoomCardAdmin;
