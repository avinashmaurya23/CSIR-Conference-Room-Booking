"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { toast } from "react-toastify";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import bookRoom from "@/app/actions/bookRoom";

// Booked dates: visually marked on calendar
const normalizeDate = (date) => {
  if (!date) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
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

// Converts "01:30 PM" -> "13:30"
function convertTo24Hour(time12h) {
  if (typeof time12h !== "string") return "";
  const [time, modifier] = time12h.split(" ");
  if (!time || !modifier) return "";
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function timeToMinutes(time) {
  if (typeof time !== "string") return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

const BookingForm = ({ room, bookedDates = [] }) => {
  const [state, formAction] = useActionState(bookRoom, {});
  const router = useRouter();

  // Mark booked dates for calendar highlighting (not disabling)
  const markedBookedDates = bookedDates.map((dateStr) => {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Form state
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  // For booked slots on selected dates
  const [bookedSlotsCheckIn, setBookedSlotsCheckIn] = useState([]);
  const [bookedSlotsCheckOut, setBookedSlotsCheckOut] = useState([]);

  // Get booked times for selected dates
  useEffect(() => {
    async function fetchBookedSlots(date, setSlots) {
      if (!date) {
        setSlots([]);
        return;
      }
      const dateStr = normalizeDate(date);
      try {
        const res = await fetch(`/api/rooms/${room.$id}/slots?date=${dateStr}`);
        if (!res.ok) throw new Error("Failed to fetch booked slots");
        const data = await res.json();
        setSlots(data);
      } catch {
        setSlots([]);
      }
    }
    fetchBookedSlots(checkInDate, setBookedSlotsCheckIn);
  }, [checkInDate, room.$id]);

  useEffect(() => {
    async function fetchBookedSlots(date, setSlots) {
      if (!date) {
        setSlots([]);
        return;
      }
      const dateStr = normalizeDate(date);
      try {
        const res = await fetch(`/api/rooms/${room.$id}/slots?date=${dateStr}`);
        if (!res.ok) throw new Error("Failed to fetch booked slots");
        const data = await res.json();
        setSlots(data);
      } catch {
        setSlots([]);
      }
    }
    fetchBookedSlots(checkOutDate, setBookedSlotsCheckOut);
  }, [checkOutDate, room.$id]);

  // Disable times that intersect with a booking on the chosen date
  const isCheckInTimeBooked = (timeAMPM) => {
    if (!timeAMPM || bookedSlotsCheckIn.length === 0) return false;
    const minutes = timeToMinutes(convertTo24Hour(timeAMPM));
    return bookedSlotsCheckIn.some(({ check_in, check_out }) => {
      if (typeof check_in !== "string" || typeof check_out !== "string")
        return false;
      const checkInParts = check_in.split("T");
      const checkOutParts = check_out.split("T");
      if (checkInParts.length < 2 || checkOutParts.length < 2) return false;
      const start = checkInParts[1].slice(0, 5);
      const end = checkOutParts[1].slice(0, 5);
      return minutes >= timeToMinutes(start) && minutes < timeToMinutes(end);
    });
  };

  // Disable times before/at check-in or that overlap booking on check-out date
  const isCheckOutTimeBooked = (timeAMPM) => {
    if (!timeAMPM || bookedSlotsCheckOut.length === 0 || !checkInTime)
      return false;
    const minutes = timeToMinutes(convertTo24Hour(timeAMPM));
    const checkInMinutes = timeToMinutes(convertTo24Hour(checkInTime));
    if (minutes <= checkInMinutes) return true;
    return bookedSlotsCheckOut.some(({ check_in, check_out }) => {
      if (typeof check_in !== "string" || typeof check_out !== "string")
        return false;
      const checkInParts = check_in.split("T");
      const checkOutParts = check_out.split("T");
      if (checkInParts.length < 2 || checkOutParts.length < 2) return false;
      const start = checkInParts[1].slice(0, 5);
      const end = checkOutParts[1].slice(0, 5);
      return minutes > timeToMinutes(start) && minutes <= timeToMinutes(end);
    });
  };

  // Handle toast messages and redirect
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
          {/* Check-In Date */}
          <div>
            <label className="block text-sm font-medium text-black">
              Check-In Date
            </label>
            <DayPicker
              mode="single"
              selected={checkInDate}
              onSelect={setCheckInDate}
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

          {/* Check-Out Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Check-Out Date
            </label>
            <DayPicker
              mode="single"
              selected={checkOutDate}
              onSelect={setCheckOutDate}
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

          {/* Check-In Time */}
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

          {/* Check-Out Time */}
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

// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useActionState } from "react";
// import { toast } from "react-toastify";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import bookRoom from "@/app/actions/bookRoom";

// // Booked dates: visually marked on calendar
// const normalizeDate = (date) => {
//   if (!date) return "";
//   const yyyy = date.getFullYear();
//   const mm = String(date.getMonth() + 1).padStart(2, "0");
//   const dd = String(date.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
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

// // Converts "01:30 PM" -> "13:30"
// function convertTo24Hour(time12h) {
//   const [time, modifier] = time12h.split(" ");
//   let [hours, minutes] = time.split(":");
//   hours = parseInt(hours, 10);
//   if (modifier === "PM" && hours !== 12) hours += 12;
//   if (modifier === "AM" && hours === 12) hours = 0;
//   return `${String(hours).padStart(2, "0")}:${minutes}`;
// }

// function timeToMinutes(time) {
//   const [hours, minutes] = time.split(":").map(Number);
//   return hours * 60 + minutes;
// }

// const BookingForm = ({ room, bookedDates = [] }) => {
//   const [state, formAction] = useActionState(bookRoom, {});
//   const router = useRouter();

//   // Mark booked dates for calendar highlighting (not disabling)
//   const markedBookedDates = bookedDates.map((dateStr) => {
//     const d = new Date(dateStr);
//     d.setHours(0, 0, 0, 0);
//     return d;
//   });

//   // Form state
//   const [checkInDate, setCheckInDate] = useState(null);
//   const [checkOutDate, setCheckOutDate] = useState(null);
//   const [checkInTime, setCheckInTime] = useState("");
//   const [checkOutTime, setCheckOutTime] = useState("");

//   // For booked slots on selected dates
//   const [bookedSlotsCheckIn, setBookedSlotsCheckIn] = useState([]);
//   const [bookedSlotsCheckOut, setBookedSlotsCheckOut] = useState([]);

//   // Get booked times for selected dates
//   useEffect(() => {
//     async function fetchBookedSlots(date, setSlots) {
//       if (!date) {
//         setSlots([]);
//         return;
//       }
//       const dateStr = normalizeDate(date);
//       try {
//         const res = await fetch(`/api/rooms/${room.$id}/slots?date=${dateStr}`);
//         if (!res.ok) throw new Error("Failed to fetch booked slots");
//         const data = await res.json();
//         setSlots(data);
//       } catch {
//         setSlots([]);
//       }
//     }
//     fetchBookedSlots(checkInDate, setBookedSlotsCheckIn);
//   }, [checkInDate, room.$id]);

//   useEffect(() => {
//     async function fetchBookedSlots(date, setSlots) {
//       if (!date) {
//         setSlots([]);
//         return;
//       }
//       const dateStr = normalizeDate(date);
//       try {
//         const res = await fetch(`/api/rooms/${room.$id}/slots?date=${dateStr}`);
//         if (!res.ok) throw new Error("Failed to fetch booked slots");
//         const data = await res.json();
//         setSlots(data);
//       } catch {
//         setSlots([]);
//       }
//     }
//     fetchBookedSlots(checkOutDate, setBookedSlotsCheckOut);
//   }, [checkOutDate, room.$id]);

//   // Disable times that intersect with a booking on the chosen date
//   const isCheckInTimeBooked = (timeAMPM) => {
//     if (!timeAMPM || bookedSlotsCheckIn.length === 0) return false;
//     const minutes = timeToMinutes(convertTo24Hour(timeAMPM));
//     return bookedSlotsCheckIn.some(({ check_in, check_out }) => {
//       const start = check_in.split("T")[1].slice(0, 5);
//       const end = check_out.split("T").slice(0, 5);
//       return minutes >= timeToMinutes(start) && minutes < timeToMinutes(end);
//     });
//   };

//   // Disable times before/at check-in or that overlap booking on check-out date
//   const isCheckOutTimeBooked = (timeAMPM) => {
//     if (!timeAMPM || bookedSlotsCheckOut.length === 0 || !checkInTime)
//       return false;
//     const minutes = timeToMinutes(convertTo24Hour(timeAMPM));
//     const checkInMinutes = timeToMinutes(convertTo24Hour(checkInTime));
//     if (minutes <= checkInMinutes) return true;
//     return bookedSlotsCheckOut.some(({ check_in, check_out }) => {
//       const start = check_in.split("T")[1].slice(0, 5);
//       const end = check_out.split("T").slice(0, 5);
//       return minutes > timeToMinutes(start) && minutes <= timeToMinutes(end);
//     });
//   };

//   // Handle toast messages and redirect
//   useEffect(() => {
//     if (state.error) toast.error(state.error);
//     if (state.success) {
//       toast.success("Room has been booked!");
//       router.push("/bookings");
//     }
//   }, [state, router]);

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
//           {/* Check-In Date */}
//           <div>
//             <label className="block text-sm font-medium text-black">
//               Check-In Date
//             </label>
//             <DayPicker
//               mode="single"
//               selected={checkInDate}
//               onSelect={setCheckInDate}
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
//           {/* Check-Out Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Check-Out Date
//             </label>
//             <DayPicker
//               mode="single"
//               selected={checkOutDate}
//               onSelect={setCheckOutDate}
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
//           {/* Check-In Time */}
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
//             {/* submit as 24hr formatted time */}
//             <input
//               type="hidden"
//               name="check_in_time"
//               value={checkInTime ? convertTo24Hour(checkInTime) : ""}
//               required
//             />
//           </div>
//           {/* Check-Out Time */}
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
//             {/* submit as 24hr formatted time */}
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
// import { useEffect, useState } from "react";
// import { useActionState } from "react";
// import { toast } from "react-toastify";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import bookRoom from "@/app/actions/bookRoom";

// const TIME_OPTIONS = [
//   "09:00",
//   "09:30",
//   "10:00",
//   "10:30",
//   "11:00",
//   "11:30",
//   "12:00",
//   "12:30",
//   "13:00",
//   "13:30",
//   "14:00",
//   "14:30",
//   "15:00",
//   "15:30",
//   "16:00",
//   "16:30",
//   "17:00",
// ];

// function timeToMinutes(time) {
//   const [hours, minutes] = time.split(":").map(Number);
//   return hours * 60 + minutes;
// }

// const BookingForm = ({ room, bookedDates = [] }) => {
//   const [state, formAction] = useActionState(bookRoom, {});
//   const router = useRouter();

//   // Normalize booked dates for display styling
//   const markedBookedDates = bookedDates.map((dateStr) => {
//     const d = new Date(dateStr);
//     d.setHours(0, 0, 0, 0);
//     return d;
//   });

//   const [checkInDate, setCheckInDate] = useState(null);
//   const [checkOutDate, setCheckOutDate] = useState(null);
//   const [checkInTime, setCheckInTime] = useState("");
//   const [checkOutTime, setCheckOutTime] = useState("");

//   const [bookedSlotsCheckIn, setBookedSlotsCheckIn] = useState([]);
//   const [bookedSlotsCheckOut, setBookedSlotsCheckOut] = useState([]);

//   // Fetch booked slots for check-in date
//   useEffect(() => {
//     async function fetchBookedSlots(date, setSlots) {
//       if (!date) {
//         setSlots([]);
//         return;
//       }
//       const dateStr = date.toISOString().split("T")[0];
//       try {
//         const res = await fetch(`/api/rooms/${room.$id}/slots?date=${dateStr}`);
//         if (!res.ok) throw new Error("Failed to fetch booked slots");
//         const data = await res.json();
//         setSlots(data);
//       } catch {
//         setSlots([]);
//       }
//     }
//     fetchBookedSlots(checkInDate, setBookedSlotsCheckIn);
//   }, [checkInDate, room.$id]);

//   // Fetch booked slots for check-out date
//   useEffect(() => {
//     async function fetchBookedSlots(date, setSlots) {
//       if (!date) {
//         setSlots([]);
//         return;
//       }
//       const dateStr = date.toISOString().split("T")[0];
//       try {
//         const res = await fetch(`/api/rooms/${room.$id}/slots?date=${dateStr}`);
//         if (!res.ok) throw new Error("Failed to fetch booked slots");
//         const data = await res.json();
//         setSlots(data);
//       } catch {
//         setSlots([]);
//       }
//     }
//     fetchBookedSlots(checkOutDate, setBookedSlotsCheckOut);
//   }, [checkOutDate, room.$id]);

//   // Disable check-in times that overlap any booking on check-in date
//   const isCheckInTimeBooked = (time) => {
//     if (!time || bookedSlotsCheckIn.length === 0) return false;
//     const minutes = timeToMinutes(time);
//     return bookedSlotsCheckIn.some(({ check_in, check_out }) => {
//       const start = check_in.split("T")[1].slice(0, 5);
//       const end = check_out.split("T")[1].slice(0, 5);
//       return minutes >= timeToMinutes(start) && minutes < timeToMinutes(end);
//     });
//   };

//   // Disable check-out times that are before or equal to check-in time or that overlap bookings on check-out date
//   const isCheckOutTimeBooked = (time) => {
//     if (!time || bookedSlotsCheckOut.length === 0 || !checkInTime) return false;
//     const minutes = timeToMinutes(time);
//     const checkInMinutes = timeToMinutes(checkInTime);

//     if (minutes <= checkInMinutes) return true; // check-out time must be after check-in time

//     return bookedSlotsCheckOut.some(({ check_in, check_out }) => {
//       const start = check_in.split("T")[1].slice(0, 5);
//       const end = check_out.split("T")[1].slice(0, 5);
//       return minutes > timeToMinutes(start) && minutes <= timeToMinutes(end);
//     });
//   };

//   useEffect(() => {
//     if (state.error) toast.error(state.error);
//     if (state.success) {
//       toast.success("Room has been booked!");
//       router.push("/bookings");
//     }
//   }, [state, router]);

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
//             Enter the Event Name :
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
//           {/* Check-In Date */}
//           <div>
//             <label className="block text-sm font-medium text-black">
//               Check-In Date
//             </label>
//             <DayPicker
//               mode="single"
//               selected={checkInDate}
//               onSelect={setCheckInDate}
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
//               value={checkInDate ? checkInDate.toISOString().split("T")[0] : ""}
//               required
//             />
//           </div>

//           {/* Check-Out Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Check-Out Date
//             </label>
//             <DayPicker
//               mode="single"
//               selected={checkOutDate}
//               onSelect={setCheckOutDate}
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
//               value={
//                 checkOutDate ? checkOutDate.toISOString().split("T")[0] : ""
//               }
//               required
//             />
//           </div>

//           {/* Check-In Time */}
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
//               {TIME_OPTIONS.map((time) => (
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
//               value={checkInTime}
//               required
//             />
//           </div>

//           {/* Check-Out Time */}
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
//               {TIME_OPTIONS.map((time) => (
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
//               value={checkOutTime}
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
// import { useEffect, useState } from "react";
// import { useActionState } from "react";
// import { toast } from "react-toastify";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import bookRoom from "@/app/actions/bookRoom";

// const TIME_SLOTS = [
//   "09:00",
//   "09:30",
//   "10:00",
//   "10:30",
//   "11:00",
//   "11:30",
//   "12:00",
//   "12:30",
//   "13:00",
//   "13:30",
//   "14:00",
//   "14:30",
//   "15:00",
//   "15:30",
//   "16:00",
//   "16:30",
//   "17:00",
// ];

// function isTimeBooked(time, bookedSlots) {
//   const timeVal = parseInt(time.replace(":", ""), 10);
//   return bookedSlots.some(({ start, end }) => {
//     const startVal = parseInt(start.replace(":", ""), 10);
//     const endVal = parseInt(end.replace(":", ""), 10);
//     return timeVal >= startVal && timeVal < endVal;
//   });
// }

// const normalizeDate = (date) => {
//   if (!date) return "";
//   return date.toLocaleDateString("en-US");
// };

// function TimePicker({ label, name, value, onChange, bookedSlots }) {
//   return (
//     <div>
//       <label htmlFor={name} className="block text-sm font-medium text-gray-700">
//         {label}
//       </label>
//       <select
//         id={name}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required
//         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//       >
//         <option value="" disabled>
//           Select Time
//         </option>
//         {TIME_SLOTS.map((time) => (
//           <option
//             key={time}
//             value={time}
//             disabled={isTimeBooked(time, bookedSlots)}
//             style={
//               isTimeBooked(time, bookedSlots) ? { color: "red" } : undefined
//             }
//           >
//             {time} {isTimeBooked(time, bookedSlots) ? "(Booked)" : ""}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// const BookingForm = ({ room, bookedDates = [] }) => {
//   const [state, formAction] = useActionState(bookRoom, {});
//   const router = useRouter();

//   // Dates to highlight but NOT disable
//   const bookedDayObjects = bookedDates.map((dateStr) => {
//     const d = new Date(dateStr);
//     return new Date(d.getFullYear(), d.getMonth(), d.getDate());
//   });

//   const [checkInDate, setCheckInDate] = useState(null);
//   const [checkOutDate, setCheckOutDate] = useState(null);

//   const [checkInTime, setCheckInTime] = useState("");
//   const [checkOutTime, setCheckOutTime] = useState("");

//   const [bookedCheckInSlots, setBookedCheckInSlots] = useState([]);
//   const [bookedCheckOutSlots, setBookedCheckOutSlots] = useState([]);

//   // Fetch booked time slots for check-in date
//   useEffect(() => {
//     if (!checkInDate) {
//       setBookedCheckInSlots([]);
//       return;
//     }
//     fetch(`/api/rooms/${room.$id}?date=${normalizeDate(checkInDate)}`)
//       .then((res) => res.json())
//       .then((data) =>
//         Array.isArray(data)
//           ? setBookedCheckInSlots(data)
//           : setBookedCheckInSlots([])
//       )
//       .catch(() => setBookedCheckInSlots([]));
//   }, [checkInDate, room]);

//   // Fetch booked time slots for check-out date
//   useEffect(() => {
//     if (!checkOutDate) {
//       setBookedCheckOutSlots([]);
//       return;
//     }
//     fetch(`/api/bookedslots/${room.$id}?date=${normalizeDate(checkOutDate)}`)
//       .then((res) => res.json())
//       .then((data) =>
//         Array.isArray(data)
//           ? setBookedCheckOutSlots(data)
//           : setBookedCheckOutSlots([])
//       )
//       .catch(() => setBookedCheckOutSlots([]));
//   }, [checkOutDate, room]);

//   useEffect(() => {
//     if (state.error) toast.error(state.error);
//     if (state.success) {
//       toast.success("Room has been booked!");
//       router.push("/bookings");
//     }
//   }, [state, router]);

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
//               // Highlight booked dates but keep selectable:
//               modifiers={{ booked: bookedDayObjects }}
//               modifiersStyles={{
//                 booked: {
//                   color: "red",
//                   fontWeight: "bold",
//                   cursor: "pointer",
//                   borderBottom: "2px solid red",
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
//             <TimePicker
//               label="Check-In Time"
//               name="check_in_time"
//               value={checkInTime}
//               onChange={(e) => setCheckInTime(e.target.value)}
//               bookedSlots={bookedCheckInSlots}
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
//               modifiers={{ booked: bookedDayObjects }}
//               modifiersStyles={{
//                 booked: {
//                   color: "red",
//                   fontWeight: "bold",
//                   cursor: "pointer",
//                   borderBottom: "2px solid red",
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
//             <TimePicker
//               label="Check-Out Time"
//               name="check_out_time"
//               value={checkOutTime}
//               onChange={(e) => setCheckOutTime(e.target.value)}
//               bookedSlots={bookedCheckOutSlots}
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
// import { useEffect, useState } from "react";
// import { useActionState } from "react";
// import { toast } from "react-toastify";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import bookRoom from "@/app/actions/bookRoom";

// // Normalize DayPicker Date object to local date string "YYYY-MM-DD" without timezone shift
// const normalizeDate = (date) => {
//   if (!date) return "";
//   return date.toLocaleDateString("en-US");
// };

// const BookingForm = ({ room, bookedDates = [] }) => {
//   const [state, formAction] = useActionState(bookRoom, {});
//   const router = useRouter();

//   // Normalize bookedDates for disabling and marking in DayPicker
//   const disabledDays = bookedDates.map((dateStr) => {
//     const d = new Date(dateStr);
//     return new Date(d.getFullYear(), d.getMonth(), d.getDate());
//   });

//   const [checkInDate, setCheckInDate] = useState(null);
//   const [checkOutDate, setCheckOutDate] = useState(null);

//   const [checkInTime, setCheckInTime] = useState("");
//   const [checkOutTime, setCheckOutTime] = useState("");

//   useEffect(() => {
//     if (state.error) toast.error(state.error);
//     if (state.success) {
//       toast.success("Room has been booked!");
//       router.push("/bookings");
//     }
//   }, [state, router]);

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
//           {/* Check-In Date */}
//           <div>
//             <label className="block text-sm font-medium text-black">
//               Check-In Date
//             </label>
//             <DayPicker
//               mode="single"
//               selected={checkInDate}
//               onSelect={setCheckInDate}
//               modifiers={{ booked: disabledDays }}
//               modifiersStyles={{ booked: { color: "red", fontWeight: "bold" } }}
//             />
//             <input
//               type="hidden"
//               name="check_in_date"
//               value={normalizeDate(checkInDate)}
//               required
//             />
//           </div>

//           {/* Check-Out Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Check-Out Date
//             </label>
//             <DayPicker
//               mode="single"
//               selected={checkOutDate}
//               onSelect={setCheckOutDate}
//               modifiers={{ booked: disabledDays }}
//               modifiersStyles={{ booked: { color: "red", fontWeight: "bold" } }}
//             />
//             <input
//               type="hidden"
//               name="check_out_date"
//               value={normalizeDate(checkOutDate)}
//               required
//             />
//           </div>

//           {/* Check-In Time */}
//           <div>
//             <label
//               htmlFor="check_in_time"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Check-In Time
//             </label>
//             <input
//               type="time"
//               id="check_in_time"
//               name="check_in_time"
//               className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               value={checkInTime}
//               onChange={(e) => setCheckInTime(e.target.value)}
//               required
//             />
//           </div>

//           {/* Check-Out Time */}
//           <div>
//             <label
//               htmlFor="check_out_time"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Check-Out Time
//             </label>
//             <input
//               type="time"
//               id="check_out_time"
//               name="check_out_time"
//               className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               value={checkOutTime}
//               onChange={(e) => setCheckOutTime(e.target.value)}
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
