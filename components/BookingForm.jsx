"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useActionState } from "react";
import { toast } from "react-toastify";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import bookRoom from "@/app/actions/bookRoom";
import { FiAlertTriangle } from "react-icons/fi";

// --- Helper Functions from your original code ---
const normalizeDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
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

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [attendees, setAttendees] = useState(0);
  const [bookedSlotsCheckIn, setBookedSlotsCheckIn] = useState([]);
  const [bookedSlotsCheckOut, setBookedSlotsCheckOut] = useState([]);

  const isOverCapacity = attendees > room.capacity;

  const markedBookedDates = useMemo(
    () =>
      bookedDates.map((dateStr) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d);
      }),
    [bookedDates]
  );

  // FIX: Restored the full implementation for data fetching and time-slot validation.
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

  const isCheckInTimeBooked = useMemo(() => {
    const bookedMinutes = new Set();
    const selectedDay = normalizeDate(checkInDate);
    bookedSlotsCheckIn.forEach(({ check_in, check_out }) => {
      const bookingStartDate = check_in.split("T")[0];
      const bookingEndDate = check_out.split("T")[0];
      let startMinutes, endMinutes;
      if (bookingStartDate === bookingEndDate) {
        startMinutes = timeToMinutes(check_in.split("T")[1].slice(0, 5));
        endMinutes = timeToMinutes(check_out.split("T")[1].slice(0, 5));
      } else {
        if (selectedDay === bookingStartDate) {
          startMinutes = timeToMinutes(check_in.split("T")[1].slice(0, 5));
          endMinutes = 24 * 60;
        } else if (selectedDay === bookingEndDate) {
          startMinutes = 0;
          endMinutes = timeToMinutes(check_out.split("T")[1].slice(0, 5));
        } else {
          startMinutes = 0;
          endMinutes = 24 * 60;
        }
      }
      for (let m = startMinutes; m < endMinutes; m += 30) {
        bookedMinutes.add(m);
      }
    });
    return (timeAMPM) => {
      if (!timeAMPM) return false;
      const minutes = timeToMinutes(convertTo24Hour(timeAMPM));
      return bookedMinutes.has(minutes);
    };
  }, [bookedSlotsCheckIn, checkInDate]);

  const isCheckOutTimeBooked = useMemo(() => {
    const isSameDay =
      checkInDate &&
      checkOutDate &&
      normalizeDate(checkInDate) === normalizeDate(checkOutDate);
    const checkInMinutes = timeToMinutes(convertTo24Hour(checkInTime));
    const selectedDay = normalizeDate(checkOutDate);
    const bookedMinutes = new Set();
    bookedSlotsCheckOut.forEach(({ check_in, check_out }) => {
      const bookingStartDate = check_in.split("T")[0];
      const bookingEndDate = check_out.split("T")[0];
      let startMinutes, endMinutes;
      if (bookingStartDate === bookingEndDate) {
        startMinutes = timeToMinutes(check_in.split("T")[1].slice(0, 5));
        endMinutes = timeToMinutes(check_out.split("T")[1].slice(0, 5));
      } else {
        if (selectedDay === bookingStartDate) {
          startMinutes = timeToMinutes(check_in.split("T")[1].slice(0, 5));
          endMinutes = 24 * 60;
        } else if (selectedDay === bookingEndDate) {
          startMinutes = 0;
          endMinutes = timeToMinutes(check_out.split("T")[1].slice(0, 5));
        } else {
          startMinutes = 0;
          endMinutes = 24 * 60;
        }
      }
      for (let m = startMinutes; m < endMinutes; m += 30) {
        bookedMinutes.add(m);
      }
    });
    let nextBookingStartMinutes = Infinity;
    if (isSameDay && checkInTime) {
      const sortedBookedStartTimes = bookedSlotsCheckOut
        .map((b) => timeToMinutes(b.check_in.split("T")[1].slice(0, 5)))
        .sort((a, b) => a - b);
      for (const startTime of sortedBookedStartTimes) {
        if (startTime > checkInMinutes) {
          nextBookingStartMinutes = startTime;
          break;
        }
      }
    }
    return (timeAMPM) => {
      if (!timeAMPM) return false;
      const minutes = timeToMinutes(convertTo24Hour(timeAMPM));
      if (isSameDay && checkInTime && minutes <= checkInMinutes) return true;
      if (bookedMinutes.has(minutes)) return true;
      if (isSameDay && checkInTime && minutes > nextBookingStartMinutes)
        return true;
      return false;
    };
  }, [bookedSlotsCheckOut, checkInDate, checkOutDate, checkInTime]);

  const disabledDaysForCheckout = useMemo(() => {
    if (!checkInDate) {
      return { before: new Date() };
    }
    const sortedBookedDates = [...markedBookedDates].sort(
      (a, b) => a.getTime() - b.getTime()
    );
    let nextBookedDate = null;
    for (const bookedDate of sortedBookedDates) {
      if (bookedDate > checkInDate) {
        nextBookedDate = bookedDate;
        break;
      }
    }
    const disabledConditions = [{ before: checkInDate }];
    if (nextBookedDate) {
      disabledConditions.push({ after: nextBookedDate });
    }
    return disabledConditions;
  }, [checkInDate, markedBookedDates]);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success("Request raised sucessfully!");
      router.push("/bookings");
    }
  }, [state, router]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Book this Conference Room
      </h2>
      <form action={formAction}>
        <input type="hidden" name="room_id" value={room.$id} />
        <input
          type="hidden"
          name="check_in_date"
          value={normalizeDate(checkInDate)}
        />
        <input
          type="hidden"
          name="check_out_date"
          value={normalizeDate(checkOutDate)}
        />
        <input
          type="hidden"
          name="check_in_time"
          value={convertTo24Hour(checkInTime)}
        />
        <input
          type="hidden"
          name="check_out_time"
          value={convertTo24Hour(checkOutTime)}
        />
        <input type="hidden" name="attendees" value={attendees} />

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="event_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Name
              </label>
              <input
                type="text"
                id="event_name"
                name="event_name"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="attendees"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Number of Attendees (Capacity: {room.capacity})
              </label>
              <input
                type="number"
                id="attendees"
                value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value))}
                min="1"
                max={room.capacity}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          {isOverCapacity && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <FiAlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">
                Attendees cannot exceed room capacity.
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-In Date
              </label>
              <DayPicker
                mode="single"
                selected={checkInDate}
                onSelect={setCheckInDate}
                disabled={{ before: new Date() }}
                modifiers={{ booked: markedBookedDates }}
                modifiersStyles={{
                  booked: { color: "red", backgroundColor: "#FFEAEA" },
                }}
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-Out Date
              </label>
              <DayPicker
                mode="single"
                selected={checkOutDate}
                onSelect={setCheckOutDate}
                disabled={disabledDaysForCheckout}
                modifiers={{ booked: markedBookedDates }}
                modifiersStyles={{
                  booked: { color: "red", backgroundColor: "#FFEAEA" },
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="check_in_time_ui"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Check-In Time
              </label>
              <select
                id="check_in_time_ui"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                disabled={!checkInDate}
                className="w-full p-2 border bg-white border-gray-300 rounded-md"
                required
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
            </div>
            <div>
              <label
                htmlFor="check_out_time_ui"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Check-Out Time
              </label>
              <select
                id="check_out_time_ui"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                disabled={!checkOutDate}
                className="w-full p-2 border bg-white border-gray-300 rounded-md"
                required
              >
                <option value="">Select time</option>
                {TIME_OPTIONS_AMPM.map((time) => (
                  <option
                    key={time}
                    value={time}
                    disabled={isCheckOutTimeBooked(time)}
                  >
                    {time} {isCheckOutTimeBooked(time) ? "(Booked)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t">
          <button
            type="submit"
            disabled={isOverCapacity}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Book Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;

// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useState, useCallback, useMemo } from "react";
// import { useActionState } from "react";
// import { toast } from "react-toastify";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import bookRoom from "@/app/actions/bookRoom";

// // --- Helper Functions ---
// const normalizeDate = (date) => {
//   if (!date) return "";
//   const d = new Date(date);
//   d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//   return d.toISOString().split("T")[0];
// };

// const TIME_OPTIONS_AMPM = [
//   "09:00 AM",
//   "09:30 AM",
//   "10:00 AM",
//   "10:30 AM",
//   "11:00 AM",
//   "11:30 AM",
//   "12:00 PM",
//   "12:30 PM",
//   "01:00 PM",
//   "01:30 PM",
//   "02:00 PM",
//   "02:30 PM",
//   "03:00 PM",
//   "03:30 PM",
//   "04:00 PM",
//   "04:30 PM",
//   "05:00 PM",
// ];

// const convertTo24Hour = (time12h) => {
//   if (typeof time12h !== "string" || !time12h.includes(" ")) return "";
//   const [time, modifier] = time12h.split(" ");
//   let [hours, minutes] = time.split(":");
//   if (modifier === "PM" && hours !== "12") hours = parseInt(hours, 10) + 12;
//   if (modifier === "AM" && hours === "12") hours = "00";
//   return `${hours.toString().padStart(2, "0")}:${minutes}`;
// };

// const timeToMinutes = (time) => {
//   if (typeof time !== "string" || !time.includes(":")) return 0;
//   const [hours, minutes] = time.split(":").map(Number);
//   return hours * 60 + minutes;
// };

// // --- Main Component ---
// const BookingForm = ({ room, bookedDates = [] }) => {
//   const [state, formAction] = useActionState(bookRoom, {});
//   const router = useRouter();

//   // --- BUG FIX: Create dates reliably to prevent timezone errors in calculations ---
//   const markedBookedDates = useMemo(
//     () =>
//       bookedDates.map((dateStr) => {
//         const [y, m, d] = dateStr.split("-").map(Number);
//         return new Date(y, m - 1, d);
//       }),
//     [bookedDates]
//   );

//   const [checkInDate, setCheckInDate] = useState(null);
//   const [checkOutDate, setCheckOutDate] = useState(null);
//   const [checkInTime, setCheckInTime] = useState("");
//   const [checkOutTime, setCheckOutTime] = useState("");
//   const [bookedSlotsCheckIn, setBookedSlotsCheckIn] = useState([]);
//   const [bookedSlotsCheckOut, setBookedSlotsCheckOut] = useState([]);

//   const fetchBookedSlots = useCallback(
//     async (date, setSlots) => {
//       if (!date) {
//         setSlots([]);
//         return;
//       }
//       const dateStr = normalizeDate(date);
//       try {
//         const res = await fetch(`/api/rooms/${room.$id}/slots?date=${dateStr}`);
//         if (!res.ok) throw new Error("Failed to fetch booked slots");
//         setSlots(await res.json());
//       } catch {
//         setSlots([]);
//       }
//     },
//     [room.$id]
//   );

//   useEffect(() => {
//     fetchBookedSlots(checkInDate, setBookedSlotsCheckIn);
//   }, [checkInDate, fetchBookedSlots]);

//   useEffect(() => {
//     fetchBookedSlots(checkOutDate, setBookedSlotsCheckOut);
//   }, [checkOutDate, fetchBookedSlots]);

//   const isCheckInTimeBooked = useMemo(() => {
//     const bookedMinutes = new Set();
//     const selectedDay = normalizeDate(checkInDate);

//     bookedSlotsCheckIn.forEach(({ check_in, check_out }) => {
//       const bookingStartDate = check_in.split("T")[0];
//       const bookingEndDate = check_out.split("T")[0];
//       let startMinutes, endMinutes;
//       if (bookingStartDate === bookingEndDate) {
//         startMinutes = timeToMinutes(check_in.split("T")[1].slice(0, 5));
//         endMinutes = timeToMinutes(check_out.split("T")[1].slice(0, 5));
//       } else {
//         if (selectedDay === bookingStartDate) {
//           startMinutes = timeToMinutes(check_in.split("T")[1].slice(0, 5));
//           endMinutes = 24 * 60;
//         } else if (selectedDay === bookingEndDate) {
//           startMinutes = 0;
//           endMinutes = timeToMinutes(check_out.split("T")[1].slice(0, 5));
//         } else {
//           startMinutes = 0;
//           endMinutes = 24 * 60;
//         }
//       }
//       for (let m = startMinutes; m < endMinutes; m += 30) {
//         bookedMinutes.add(m);
//       }
//     });

//     return (timeAMPM) => {
//       if (!timeAMPM) return false;
//       const minutes = timeToMinutes(convertTo24Hour(timeAMPM));
//       return bookedMinutes.has(minutes);
//     };
//   }, [bookedSlotsCheckIn, checkInDate]);

//   const isCheckOutTimeBooked = useMemo(() => {
//     const isSameDay =
//       checkInDate &&
//       checkOutDate &&
//       normalizeDate(checkInDate) === normalizeDate(checkOutDate);
//     const checkInMinutes = timeToMinutes(convertTo24Hour(checkInTime));
//     const selectedDay = normalizeDate(checkOutDate);

//     const bookedMinutes = new Set();

//     bookedSlotsCheckOut.forEach(({ check_in, check_out }) => {
//       const bookingStartDate = check_in.split("T")[0];
//       const bookingEndDate = check_out.split("T")[0];
//       let startMinutes, endMinutes;
//       if (bookingStartDate === bookingEndDate) {
//         startMinutes = timeToMinutes(check_in.split("T")[1].slice(0, 5));
//         endMinutes = timeToMinutes(check_out.split("T")[1].slice(0, 5));
//       } else {
//         if (selectedDay === bookingStartDate) {
//           startMinutes = timeToMinutes(check_in.split("T")[1].slice(0, 5));
//           endMinutes = 24 * 60;
//         } else if (selectedDay === bookingEndDate) {
//           startMinutes = 0;
//           endMinutes = timeToMinutes(check_out.split("T")[1].slice(0, 5));
//         } else {
//           startMinutes = 0;
//           endMinutes = 24 * 60;
//         }
//       }
//       for (let m = startMinutes; m < endMinutes; m += 30) {
//         bookedMinutes.add(m);
//       }
//     });

//     // --- BUG FIX FOR TIME-JUMPING STARTS HERE ---
//     let nextBookingStartMinutes = Infinity;
//     if (isSameDay && checkInTime) {
//       const sortedBookedStartTimes = bookedSlotsCheckOut
//         .map((b) => timeToMinutes(b.check_in.split("T")[1].slice(0, 5)))
//         .sort((a, b) => a - b);

//       for (const startTime of sortedBookedStartTimes) {
//         if (startTime > checkInMinutes) {
//           nextBookingStartMinutes = startTime;
//           break;
//         }
//       }
//     }
//     // --- BUG FIX FOR TIME-JUMPING ENDS HERE ---

//     return (timeAMPM) => {
//       if (!timeAMPM) return false;
//       const minutes = timeToMinutes(convertTo24Hour(timeAMPM));

//       if (isSameDay && checkInTime && minutes <= checkInMinutes) return true;
//       if (bookedMinutes.has(minutes)) return true;
//       if (isSameDay && checkInTime && minutes > nextBookingStartMinutes)
//         return true;

//       return false;
//     };
//   }, [bookedSlotsCheckOut, checkInDate, checkOutDate, checkInTime]);

//   useEffect(() => {
//     if (state.error) toast.error(state.error);
//     if (state.success) {
//       toast.success("Room has been booked!");
//       router.push("/bookings");
//     }
//   }, [state, router]);

//   // --- BUG FIX FOR DATE-JUMPING STARTS HERE ---
//   const disabledDaysForCheckout = useMemo(() => {
//     if (!checkInDate) {
//       return { before: new Date() };
//     }

//     const sortedBookedDates = [...markedBookedDates].sort(
//       (a, b) => a.getTime() - b.getTime()
//     );

//     let nextBookedDate = null;
//     for (const bookedDate of sortedBookedDates) {
//       if (bookedDate >= checkInDate) {
//         nextBookedDate = bookedDate;
//         break;
//       }
//     }

//     const disabledConditions = [{ before: checkInDate }];
//     console.log("nextBookedDate", nextBookedDate);
//     if (nextBookedDate) {
//       disabledConditions.push({ after: nextBookedDate }); //need to do after for proper working of this
//     }

//     return disabledConditions;
//   }, [checkInDate, markedBookedDates]);
//   // --- BUG FIX FOR DATE-JUMPING ENDS HERE ---

//   return (
//     <div className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <h2 className="text-xl text-gray-800 font-bold">
//         Book this Conference Room
//       </h2>
//       <form action={formAction} className="mt-4">
//         <input type="hidden" name="room_id" value={room.$id} />
//         <div className="mb-4">
//           <label
//             htmlFor="event_name"
//             className="block text-gray-700 font-bold mb-2"
//           >
//             Enter the Event Name:
//           </label>
//           <input
//             type="text"
//             id="event_name"
//             name="event_name"
//             className="border rounded w-full py-2 px-3"
//             required
//           />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-black">
//           <div>
//             <label className="block text-sm font-medium text-black">
//               Check-In Date
//             </label>
//             <DayPicker
//               mode="single"
//               selected={checkInDate}
//               onSelect={setCheckInDate}
//               disabled={{ before: new Date() }}
//               modifiers={{ booked: markedBookedDates }}
//               modifiersStyles={{
//                 booked: {
//                   backgroundColor: "#FFEAEA",
//                   color: "red",
//                   fontWeight: "bold",
//                   borderRadius: "0.25rem",
//                 },
//               }}
//             />
//             <input
//               type="hidden"
//               name="check_in_date"
//               value={normalizeDate(checkInDate)}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Check-Out Date
//             </label>
//             <DayPicker
//               mode="single"
//               selected={checkOutDate}
//               onSelect={setCheckOutDate}
//               disabled={disabledDaysForCheckout}
//               modifiers={{ booked: markedBookedDates }}
//               modifiersStyles={{
//                 booked: {
//                   backgroundColor: "#FFEAEA",
//                   color: "red",
//                   fontWeight: "bold",
//                   borderRadius: "0.25rem",
//                 },
//               }}
//             />
//             <input
//               type="hidden"
//               name="check_out_date"
//               value={normalizeDate(checkOutDate)}
//               required
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="check_in_time_ui"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Check-In Time
//             </label>
//             <select
//               id="check_in_time_ui"
//               value={checkInTime}
//               onChange={(e) => setCheckInTime(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               required
//               disabled={!checkInDate}
//             >
//               <option value="">Select time</option>
//               {TIME_OPTIONS_AMPM.map((time) => (
//                 <option
//                   key={time}
//                   value={time}
//                   disabled={isCheckInTimeBooked(time)}
//                 >
//                   {time} {isCheckInTimeBooked(time) ? "(Booked)" : ""}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="hidden"
//               name="check_in_time"
//               value={checkInTime ? convertTo24Hour(checkInTime) : ""}
//               required
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="check_out_time_ui"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Check-Out Time
//             </label>
//             <select
//               id="check_out_time_ui"
//               value={checkOutTime}
//               onChange={(e) => setCheckOutTime(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               required
//               disabled={!checkOutDate}
//             >
//               <option value="">Select time</option>
//               {TIME_OPTIONS_AMPM.map((time) => (
//                 <option
//                   key={time}
//                   value={time}
//                   disabled={isCheckOutTimeBooked(time)}
//                 >
//                   {time}{" "}
//                   {isCheckOutTimeBooked(time) ? "(Booked or Invalid)" : ""}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="hidden"
//               name="check_out_time"
//               value={checkOutTime ? convertTo24Hour(checkOutTime) : ""}
//               required
//             />
//           </div>
//         </div>
//         <div className="mt-6">
//           <button
//             type="submit"
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
//           >
//             Book Room
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default BookingForm;

// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useState, useCallback, useMemo } from "react";
// import { useActionState } from "react";
// import { toast } from "react-toastify";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import bookRoom from "@/app/actions/bookRoom";

// // --- Helper Functions ---
// const normalizeDate = (date) => {
//   if (!date) return "";
//   const d = new Date(date);
//   d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//   return d.toISOString().split("T")[0];
// };

// const TIME_OPTIONS_AMPM = [
//   "09:00 AM",
//   "09:30 AM",
//   "10:00 AM",
//   "10:30 AM",
//   "11:00 AM",
//   "11:30 AM",
//   "12:00 PM",
//   "12:30 PM",
//   "01:00 PM",
//   "01:30 PM",
//   "02:00 PM",
//   "02:30 PM",
//   "03:00 PM",
//   "03:30 PM",
//   "04:00 PM",
//   "04:30 PM",
//   "05:00 PM",
// ];

// const convertTo24Hour = (time12h) => {
//   if (typeof time12h !== "string" || !time12h.includes(" ")) return "";
//   const [time, modifier] = time12h.split(" ");
//   let [hours, minutes] = time.split(":");
//   if (modifier === "PM" && hours !== "12") hours = parseInt(hours, 10) + 12;
//   if (modifier === "AM" && hours === "12") hours = "00";
//   return `${hours.toString().padStart(2, "0")}:${minutes}`;
// };

// const timeToMinutes = (time) => {
//   if (typeof time !== "string" || !time.includes(":")) return 0;
//   const [hours, minutes] = time.split(":").map(Number);
//   return hours * 60 + minutes;
// };

// // --- Main Component ---
// const BookingForm = ({ room, bookedDates = [] }) => {
//   const [state, formAction] = useActionState(bookRoom, {});
//   const router = useRouter();
//   const markedBookedDates = bookedDates.map((dateStr) => new Date(dateStr));

//   const [checkInDate, setCheckInDate] = useState(null);
//   const [checkOutDate, setCheckOutDate] = useState(null);
//   const [checkInTime, setCheckInTime] = useState("");
//   const [checkOutTime, setCheckOutTime] = useState("");
//   const [bookedSlotsCheckIn, setBookedSlotsCheckIn] = useState([]);
//   const [bookedSlotsCheckOut, setBookedSlotsCheckOut] = useState([]);

//   const fetchBookedSlots = useCallback(
//     async (date, setSlots) => {
//       if (!date) {
//         setSlots([]);
//         return;
//       }
//       const dateStr = normalizeDate(date);
//       try {
//         const res = await fetch(`/api/rooms/${room.$id}/slots?date=${dateStr}`);
//         if (!res.ok) throw new Error("Failed to fetch booked slots");
//         setSlots(await res.json());
//       } catch {
//         setSlots([]);
//       }
//     },
//     [room.$id]
//   );

//   useEffect(() => {
//     fetchBookedSlots(checkInDate, setBookedSlotsCheckIn);
//   }, [checkInDate, fetchBookedSlots]);

//   useEffect(() => {
//     fetchBookedSlots(checkOutDate, setBookedSlotsCheckOut);
//   }, [checkOutDate, fetchBookedSlots]);

//   // --- REVISED LOGIC FOR isCheckInTimeBooked ---
//   const isCheckInTimeBooked = useMemo(() => {
//     const bookedMinutes = new Set();
//     const selectedDay = normalizeDate(checkInDate);

//     bookedSlotsCheckIn.forEach(({ check_in, check_out }) => {
//       const bookingStartDate = check_in.split("T")[0];
//       const bookingEndDate = check_out.split("T")[0];

//       let startMinutes, endMinutes;

//       if (bookingStartDate === bookingEndDate) {
//         // Single-day booking
//         startMinutes = timeToMinutes(check_in.split("T")[1].slice(0, 5));
//         endMinutes = timeToMinutes(check_out.split("T")[1].slice(0, 5));
//       } else {
//         // Multi-day booking
//         if (selectedDay === bookingStartDate) {
//           // We are on the start day of the multi-day booking
//           startMinutes = timeToMinutes(check_in.split("T")[1].slice(0, 5));
//           endMinutes = 24 * 60; // Block until end of day
//         } else if (selectedDay === bookingEndDate) {
//           // We are on the end day
//           startMinutes = 0; // Block from start of day
//           endMinutes = timeToMinutes(check_out.split("T")[1].slice(0, 5));
//         } else {
//           // We are in the middle of the booking
//           startMinutes = 0;
//           endMinutes = 24 * 60; // Block the entire day
//         }
//       }

//       for (let m = startMinutes; m < endMinutes; m += 30) {
//         bookedMinutes.add(m);
//       }
//     });

//     return (timeAMPM) => {
//       if (!timeAMPM) return false;
//       const minutes = timeToMinutes(convertTo24Hour(timeAMPM));
//       return bookedMinutes.has(minutes);
//     };
//   }, [bookedSlotsCheckIn, checkInDate]);

//   // --- REVISED LOGIC FOR isCheckOutTimeBooked ---
//   const isCheckOutTimeBooked = useMemo(() => {
//     const isSameDay =
//       checkInDate &&
//       checkOutDate &&
//       normalizeDate(checkInDate) === normalizeDate(checkOutDate);
//     const checkInMinutes = timeToMinutes(convertTo24Hour(checkInTime));
//     const selectedDay = normalizeDate(checkOutDate);

//     const bookedMinutes = new Set();

//     bookedSlotsCheckOut.forEach(({ check_in, check_out }) => {
//       const bookingStartDate = check_in.split("T")[0];
//       const bookingEndDate = check_out.split("T")[0];

//       let startMinutes, endMinutes;

//       if (bookingStartDate === bookingEndDate) {
//         startMinutes = timeToMinutes(check_in.split("T")[1].slice(0, 5));
//         endMinutes = timeToMinutes(check_out.split("T")[1].slice(0, 5));
//       } else {
//         if (selectedDay === bookingStartDate) {
//           startMinutes = timeToMinutes(check_in.split("T")[1].slice(0, 5));
//           endMinutes = 24 * 60;
//         } else if (selectedDay === bookingEndDate) {
//           startMinutes = 0;
//           endMinutes = timeToMinutes(check_out.split("T")[1].slice(0, 5));
//         } else {
//           startMinutes = 0;
//           endMinutes = 24 * 60;
//         }
//       }
//       // Note: we check for the final time slot, not `m < end`. A booking until 5 PM should make 5 PM available.
//       for (let m = startMinutes; m < endMinutes; m += 30) {
//         // The checkout time itself can be a start of another booking, so we check `m + 1` to ensure the slot is truly free.
//         // e.g. Booked 9:00-9:30. A new booking can start at 9:30.
//         bookedMinutes.add(m);
//       }
//     });

//     return (timeAMPM) => {
//       if (!timeAMPM) return false;
//       const minutes = timeToMinutes(convertTo24Hour(timeAMPM));

//       if (isSameDay && checkInTime && minutes <= checkInMinutes) {
//         return true; // Checkout must be after check-in on the same day
//       }

//       return bookedMinutes.has(minutes);
//     };
//   }, [bookedSlotsCheckOut, checkInDate, checkOutDate, checkInTime]);

//   useEffect(() => {
//     if (state.error) toast.error(state.error);
//     if (state.success) {
//       toast.success("Room has been booked!");
//       router.push("/bookings");
//     }
//   }, [state, router]);

//   return (
//     // The rest of your JSX remains the same
//     <div className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <h2 className="text-xl text-gray-800 font-bold">
//         Book this Conference Room
//       </h2>
//       <form action={formAction} className="mt-4">
//         <input type="hidden" name="room_id" value={room.$id} />
//         <div className="mb-4">
//           <label
//             htmlFor="event_name"
//             className="block text-gray-700 font-bold mb-2"
//           >
//             Enter the Event Name:
//           </label>
//           <input
//             type="text"
//             id="event_name"
//             name="event_name"
//             className="border rounded w-full py-2 px-3"
//             required
//           />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-black">
//           <div>
//             <label className="block text-sm font-medium text-black">
//               Check-In Date
//             </label>
//             <DayPicker
//               mode="single"
//               selected={checkInDate}
//               onSelect={setCheckInDate}
//               disabled={{ before: new Date() }}
//               modifiers={{ booked: markedBookedDates }}
//               modifiersStyles={{
//                 booked: {
//                   backgroundColor: "#FFEAEA",
//                   color: "red",
//                   fontWeight: "bold",
//                   borderRadius: "0.25rem",
//                 },
//               }}
//             />
//             <input
//               type="hidden"
//               name="check_in_date"
//               value={normalizeDate(checkInDate)}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Check-Out Date
//             </label>
//             <DayPicker
//               mode="single"
//               selected={checkOutDate}
//               onSelect={setCheckOutDate}
//               disabled={{ before: checkInDate || new Date() }}
//               modifiers={{ booked: markedBookedDates }}
//               modifiersStyles={{
//                 booked: {
//                   backgroundColor: "#FFEAEA",
//                   color: "red",
//                   fontWeight: "bold",
//                   borderRadius: "0.25rem",
//                 },
//               }}
//             />
//             <input
//               type="hidden"
//               name="check_out_date"
//               value={normalizeDate(checkOutDate)}
//               required
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="check_in_time_ui"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Check-In Time
//             </label>
//             <select
//               id="check_in_time_ui"
//               value={checkInTime}
//               onChange={(e) => setCheckInTime(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               required
//               disabled={!checkInDate}
//             >
//               <option value="">Select time</option>
//               {TIME_OPTIONS_AMPM.map((time) => (
//                 <option
//                   key={time}
//                   value={time}
//                   disabled={isCheckInTimeBooked(time)}
//                 >
//                   {time} {isCheckInTimeBooked(time) ? "(Booked)" : ""}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="hidden"
//               name="check_in_time"
//               value={checkInTime ? convertTo24Hour(checkInTime) : ""}
//               required
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="check_out_time_ui"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Check-Out Time
//             </label>
//             <select
//               id="check_out_time_ui"
//               value={checkOutTime}
//               onChange={(e) => setCheckOutTime(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               required
//               disabled={!checkOutDate}
//             >
//               <option value="">Select time</option>
//               {TIME_OPTIONS_AMPM.map((time) => (
//                 <option
//                   key={time}
//                   value={time}
//                   disabled={isCheckOutTimeBooked(time)}
//                 >
//                   {time}{" "}
//                   {isCheckOutTimeBooked(time) ? "(Booked or Invalid)" : ""}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="hidden"
//               name="check_out_time"
//               value={checkOutTime ? convertTo24Hour(checkOutTime) : ""}
//               required
//             />
//           </div>
//         </div>
//         <div className="mt-6">
//           <button
//             type="submit"
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
//           >
//             Book Room
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default BookingForm;
