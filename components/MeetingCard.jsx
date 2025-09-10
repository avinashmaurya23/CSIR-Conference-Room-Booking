import React from "react";
import { FaClock, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { DateTime } from "luxon";

// Helper function using Luxon for cleaner, more reliable date formatting.
const formatDate = (dateString) => {
  return DateTime.fromISO(dateString, { zone: "utc" }).toFormat(
    "MMM d 'at' h:mm a"
  );
};

export default function MeetingCard({ meeting }) {
  const { room_id: room } = meeting;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 mb-4 flex flex-col h-full">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">
          {room.name}
        </h3>
        <div className="flex items-center text-sm text-gray-700">
          <span className=" font-semibold truncate">{meeting.event_name}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <FaClock className="text-indigo-500 mr-2" />
          <span className="font-semibold">Starts:</span>
          <span className="ml-2">{formatDate(meeting.check_in)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <FaClock className="text-indigo-500 mr-2" />
          <span className="font-semibold">Ends:</span>
          <span className="ml-2">{formatDate(meeting.check_out)}</span>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <span className="font-semibold">Capacity:</span>
          <div className="flex items-center">
            <FaUsers className="text-gray-500 mr-1" />
            <span>{room.capacity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
