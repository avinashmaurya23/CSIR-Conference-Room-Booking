import React from "react";
// FiHome is now imported instead of FiMapPin
import { FiClock, FiUsers, FiHome } from "react-icons/fi";
import { DateTime } from "luxon";

export default function MeetingCard({ meeting }) {
  const { room_id: room } = meeting;

  const checkInDt = DateTime.fromISO(meeting.check_in, { zone: "utc" });
  const checkOutDt = DateTime.fromISO(meeting.check_out, { zone: "utc" });

  const isSingleDay = checkInDt.hasSame(checkOutDt, "day");

  let displayDate;

  if (isSingleDay) {
    displayDate = `${checkInDt.toFormat("MMM d")}, ${checkInDt.toFormat(
      "h:mm a"
    )} - ${checkOutDt.toFormat("h:mm a")}`;
  } else {
    displayDate = `${checkInDt.toFormat(
      "MMM d, h:mm a"
    )} - ${checkOutDt.toFormat("MMM d, h:mm a")}`;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 flex flex-col h-full">
      {/* Top Section */}
      <div className="flex-grow">
        <p className="font-semibold text-gray-900">{meeting.event_name}</p>
        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
          <FiClock className="h-4 w-4 text-gray-400" />
          <span>{displayDate}</span>
        </p>
      </div>

      {/* --- Footer Section: UPDATED --- */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        {/* Left side: Room Name with the new icon */}
        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {/* ICON CHANGE: Replaced FiMapPin with FiHome */}
          <FiHome className="h-4 w-4 text-purple-500" />
          <span>{room.name}</span>
        </p>

        {/* Right side: Number of Attendees */}
        {meeting?.attendees > 0 && (
          <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <FiUsers className="h-4 w-4 text-cyan-500" />
            <span>{meeting.attendees}</span>
          </p>
        )}
      </div>
    </div>
  );
}
