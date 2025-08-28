"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react"; // Imported useCallback and useMemo
import { useActionState } from "react";
import { toast } from "react-toastify";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import bookRoom from "@/app/actions/bookRoom";

// --- Helper Functions (Moved outside component for optimization) ---
const normalizeDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  // Adjust for timezone to prevent off-by-one-day errors
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

const TIME_OPTIONS_AMPM = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
];

const convertTo24Hour = (time12h) => {
  if (typeof time12h !== "string" || !time12h.includes(" ")) return "";
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (modifier === "PM" && hours !== "12") hours = parseInt(hours, 10) + 12;
  if (modifier === "AM" && hours === "12") hours = "00";
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

const timeToMinutes = (time) => {
  if (typeof time !== "string" || !time.includes(":")) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// --- Main Component ---
const BookingForm = ({ room, bookedDates = [] }) => {
  const [state, formAction] = useActionState(bookRoom, {});
  const router = useRouter();

  const markedBookedDates = bookedDates.map((dateStr) => new Date(dateStr));

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const [bookedSlotsCheckIn, setBookedSlotsCheckIn] = useState([]);
  const [bookedSlotsCheckOut, setBookedSlotsCheckOut] = useState([]);

  // Optimized data fetching with useCallback
  const fetchBookedSlots = useCallback(
    async (date, setSlots) => {
      if (!date) {
        setSlots([]);
        return;
      }
      const dateStr = normalizeDate(date);
      try {
        const res = await fetch(`/api/rooms/${room.$id}/slots?date=${dateStr}`);
        if (!res.ok) throw new Error("Failed to fetch booked slots");
        setSlots(await res.json());
      } catch {
        setSlots([]);
      }
    },
    [room.$id]
  );

  useEffect(() => {
    fetchBookedSlots(checkInDate, setBookedSlotsCheckIn);
  }, [checkInDate, fetchBookedSlots]);

  useEffect(() => {
    fetchBookedSlots(checkOutDate, setBookedSlotsCheckOut);
  }, [checkOutDate, fetchBookedSlots]);

  // Memoized calculation for disabled times to improve performance
  const isCheckInTimeBooked = useMemo(() => {
    const bookedMinutes = new Set();
    bookedSlotsCheckIn.forEach(({ check_in, check_out }) => {
      const start = timeToMinutes(check_in.split("T")[1].slice(0, 5));
      const end = timeToMinutes(check_out.split("T")[1].slice(0, 5));
      for (let m = start; m < end; m += 30) {
        bookedMinutes.add(m);
      }
    });
    return (timeAMPM) => {
      if (!timeAMPM) return false;
      const minutes = timeToMinutes(convertTo24Hour(timeAMPM));
      return bookedMinutes.has(minutes);
    };
  }, [bookedSlotsCheckIn]);

  const isCheckOutTimeBooked = useMemo(() => {
    const isSameDay =
      checkInDate &&
      checkOutDate &&
      normalizeDate(checkInDate) === normalizeDate(checkOutDate);
    const checkInMinutes = timeToMinutes(convertTo24Hour(checkInTime));

    const bookedMinutes = new Set();
    bookedSlotsCheckOut.forEach(({ check_in, check_out }) => {
      const start = timeToMinutes(check_in.split("T")[1].slice(0, 5));
      const end = timeToMinutes(check_out.split("T")[1].slice(0, 5));
      for (let m = start; m < end; m += 30) {
        bookedMinutes.add(m + 1); // Add 1 to handle end-time logic correctly
      }
    });

    return (timeAMPM) => {
      if (!timeAMPM) return false;
      const minutes = timeToMinutes(convertTo24Hour(timeAMPM));

      // **BUG FIX:** Only apply this rule if it's the same day
      if (isSameDay && checkInTime && minutes <= checkInMinutes) {
        return true;
      }
      return bookedMinutes.has(minutes);
    };
  }, [bookedSlotsCheckOut, checkInDate, checkOutDate, checkInTime]);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success("Room has been booked!");
      router.push("/bookings");
    }
  }, [state, router]);

  return (
    <div className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl text-gray-800 font-bold">
        Book this Conference Room
      </h2>
      <form action={formAction} className="mt-4">
        <input type="hidden" name="room_id" value={room.$id} />
        <div className="mb-4">
          <label
            htmlFor="event_name"
            className="block text-gray-700 font-bold mb-2"
          >
            Enter the Event Name:
          </label>
          <input
            type="text"
            id="event_name"
            name="event_name"
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-black">
          <div>
            <label className="block text-sm font-medium text-black">
              Check-In Date
            </label>
            <DayPicker
              mode="single"
              selected={checkInDate}
              onSelect={setCheckInDate}
              disabled={{ before: new Date() }} // Prevent selecting past dates
              modifiers={{ booked: markedBookedDates }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "#FFEAEA",
                  color: "red",
                  fontWeight: "bold",
                  borderRadius: "0.25rem",
                },
              }}
            />
            <input
              type="hidden"
              name="check_in_date"
              value={normalizeDate(checkInDate)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Check-Out Date
            </label>
            <DayPicker
              mode="single"
              selected={checkOutDate}
              onSelect={setCheckOutDate}
              disabled={{ before: checkInDate || new Date() }} // Prevent selecting date before check-in
              modifiers={{ booked: markedBookedDates }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "#FFEAEA",
                  color: "red",
                  fontWeight: "bold",
                  borderRadius: "0.25rem",
                },
              }}
            />
            <input
              type="hidden"
              name="check_out_date"
              value={normalizeDate(checkOutDate)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="check_in_time_ui"
              className="block text-sm font-medium text-gray-700"
            >
              Check-In Time
            </label>
            <select
              id="check_in_time_ui"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled={!checkInDate}
            >
              <option value="">Select time</option>
              {TIME_OPTIONS_AMPM.map((time) => (
                <option
                  key={time}
                  value={time}
                  disabled={isCheckInTimeBooked(time)}
                >
                  {time} {isCheckInTimeBooked(time) ? "(Booked)" : ""}
                </option>
              ))}
            </select>
            <input
              type="hidden"
              name="check_in_time"
              value={checkInTime ? convertTo24Hour(checkInTime) : ""}
              required
            />
          </div>

          <div>
            <label
              htmlFor="check_out_time_ui"
              className="block text-sm font-medium text-gray-700"
            >
              Check-Out Time
            </label>
            <select
              id="check_out_time_ui"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled={!checkOutDate}
            >
              <option value="">Select time</option>
              {TIME_OPTIONS_AMPM.map((time) => (
                <option
                  key={time}
                  value={time}
                  disabled={isCheckOutTimeBooked(time)}
                >
                  {time}{" "}
                  {isCheckOutTimeBooked(time) ? "(Booked or Invalid)" : ""}
                </option>
              ))}
            </select>
            <input
              type="hidden"
              name="check_out_time"
              value={checkOutTime ? convertTo24Hour(checkOutTime) : ""}
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
          >
            Book Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
