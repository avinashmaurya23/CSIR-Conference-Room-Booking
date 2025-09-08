"use client";

import React, { useState, useEffect } from "react";
// --- CHANGES ARE HERE ---
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
// --- END CHANGES ---

import { bookRoom, getBookings } from "@/app/rooms/[id]/actions";
import { toast } from "react-toastify";

// Define your time slots... (rest of the code is the same)
const timeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

const BookingPopover = ({ room, onClose }) => {
  // All the state and functions (useState, useEffect, handleBooking) remain the same.
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBookingsForDate = async () => {
      if (!selectedDate) return;
      setIsLoading(true);
      const bookings = await getBookings(room.$id, selectedDate.toISOString());
      const slots = bookings.map((booking) => booking.timeSlot);
      setBookedSlots(slots);
      setSelectedSlot("");
      setIsLoading(false);
    };

    fetchBookingsForDate();
  }, [selectedDate, room.$id]);

  const handleBooking = async () => {
    if (!selectedSlot || !selectedDate) {
      toast.error("Please select a date and a time slot.");
      return;
    }
    setIsLoading(true);
    try {
      await bookRoom({
        roomId: room.$id,
        date: selectedDate.toISOString(),
        timeSlot: selectedSlot,
      });
      toast.success("Room booked successfully!");
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute top-full left-0 w-full md:w-[600px] md:left-1/2 md:-translate-x-1/2 mt-2 bg-gray-50 border rounded-lg shadow-xl p-4 z-10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Book {room.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-shrink-0">
          {/* --- CHANGE THE COMPONENT TAG HERE --- */}
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border p-2 bg-white" // Added padding and bg for better looks
            disabled={(date) =>
              date < new Date(new Date().setDate(new Date().getDate() - 1))
            }
          />
        </div>

        {/* The time slots and button section remains exactly the same */}
        <div className="flex-1">
          {/* ... time slots logic ... */}
          <h4 className="font-semibold mb-2">Select a Time Slot</h4>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              return (
                <button
                  key={slot}
                  disabled={isBooked || isLoading}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-2 border rounded-md text-sm transition-colors ${
                    isBooked
                      ? "bg-red-200 text-gray-500 cursor-not-allowed"
                      : ""
                  } ${
                    selectedSlot === slot
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        {/* ... booking button ... */}
        <button
          onClick={handleBooking}
          disabled={!selectedSlot || isLoading}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default BookingPopover;
