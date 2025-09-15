"use client";

import { bookings, rooms } from "./data";
import { formatDateToYMD } from "@/utils/dateUtils";

export default function BookingList({ selectedDate }) {
  const selectedYMD = formatDateToYMD(selectedDate);
  const filteredBookings = bookings.filter(
    (booking) => formatDateToYMD(new Date(booking.start)) === selectedYMD
  );

  return (
    <div>
      <h2 className="font-semibold text-lg mb-2">
        Bookings for {selectedDate.toDateString()}
      </h2>
      {filteredBookings.length === 0 && <div>No bookings on this date.</div>}

      <div className="space-y-2">
        {filteredBookings.map((booking) => {
          const room = rooms.find((r) => r.id === booking.roomId);
          return (
            <div
              key={booking.id}
              className="border border-gray-300 rounded p-2"
              style={{ borderLeftColor: room?.color }}
            >
              <div className="font-semibold">{booking.title}</div>
              <div className="text-sm text-gray-600">
                {room?.name} |{" "}
                {new Date(booking.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(booking.end).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
