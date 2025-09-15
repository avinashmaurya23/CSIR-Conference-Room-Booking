"use client";

import { useState } from "react";
import { rooms, bookings, addBooking, isConflict } from "./data";
import { formatDateTimeToLocalInput } from "@/utils/dateUtils";

export default function BookingModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [roomId, setRoomId] = useState(rooms[0].id);
  const [start, setStart] = useState(formatDateTimeToLocalInput(new Date()));
  const [end, setEnd] = useState(
    formatDateTimeToLocalInput(new Date(Date.now() + 30 * 60000))
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === "") {
      alert("Enter a booking title");
      return;
    }
    if (end <= start) {
      alert("End time must be after start time");
      return;
    }
    if (isConflict(start, end, roomId)) {
      alert("Booking conflict detected");
      return;
    }

    addBooking({ title, roomId, start, end, user: "Current User" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-xl font-bold mb-4">Book a Room</h2>
        {/* Inputs like title, room select, start & end datetime here */}
        {/* Similar to previous example */}
      </form>
    </div>
  );
}
