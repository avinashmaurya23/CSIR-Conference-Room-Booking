"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";

function toUTCDateTime(dateString) {
  return DateTime.fromISO(dateString, { zone: "utc" }).toUTC();
}

//Check for overlapping date ranges
function dateRangesOverlap(checkInA, checkOutA, checkInB, checkOutB) {
  return checkInA < checkOutB && checkOutA > checkInB;
}

async function checkRoomAvailability(roomId, checkIn, checkOut) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("appwrite-session");

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    const checkInDateTime = toUTCDateTime(checkIn);
    const checkOutDateTime = toUTCDateTime(checkOut);

    //Fetch all bookings for a given room
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      [Query.equal("room_id", roomId)]
    );

    //Loop through bookings to check for conflicts
    for (const booking of bookings) {
      const bookingCheckInDateTime = toUTCDateTime(booking.check_in);
      const bookingCheckOutDateTime = toUTCDateTime(booking.check_out);

      // Check if the requested dates overlap with any existing booking
      if (
        dateRangesOverlap(
          checkInDateTime,
          checkOutDateTime,
          bookingCheckInDateTime,
          bookingCheckOutDateTime
        )
      ) {
        // Overlap found, check the status and return a specific error
        if (booking.booking_status === "confirm") {
          return {
            available: false,
            error: "Room is already booked for an event.",
          };
        }
        if (booking.booking_status === "pending") {
          return {
            available: false,
            error: "There's already a booking request on this date.",
          };
        }
        // Fallback for any other status
        return {
          available: false,
          error: "The room is not available for the selected dates.",
        };
      }
    }
    // No overlaps found, room is available
    return { available: true };
  } catch (error) {
    console.log("Failed to check Availability", error);
    return {
      available: false,
      error: "Failed to check room availability. Please try again later.",
    };
  }
}

export default checkRoomAvailability;

// "use server";

// import { createSessionClient } from "@/config/appwrite";
// import { cookies } from "next/headers";
// import { Query } from "node-appwrite";
// import { redirect } from "next/navigation";
// import { DateTime } from "luxon";

// function toUTCDateTime(dateString) {
//   return DateTime.fromISO(dateString, { zone: "utc" }).toUTC();
// }

// //Check for overlapping date ranges
// function dateRangesOverlap(checkInA, checkOutA, checkInB, checkOutB) {
//   return checkInA < checkOutB && checkOutA > checkInB;
// }

// async function checkRoomAvailability(roomId, checkIn, checkOut) {
//   const cookieStore = await cookies();
//   const sessionCookie = cookieStore.get("appwrite-session");

//   if (!sessionCookie) {
//     redirect("/login");
//   }

//   try {
//     const { databases } = await createSessionClient(sessionCookie.value);
//     const checkInDateTime = toUTCDateTime(checkIn);
//     const checkOutDateTime = toUTCDateTime(checkOut);

//     //Fetch all bookings for a given room
//     const { documents: bookings } = await databases.listDocuments(
//       process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
//       process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
//       [Query.equal("room_id", roomId)]
//     );

//     //Loop through bookings to check for conflicts
//     for (const booking of bookings) {
//       const bookingCheckInDateTime = toUTCDateTime(booking.check_in);
//       const bookingCheckOutDateTime = toUTCDateTime(booking.check_out);

//       // Check if the requested dates overlap with any existing booking
//       if (
//         dateRangesOverlap(
//           checkInDateTime,
//           checkOutDateTime,
//           bookingCheckInDateTime,
//           bookingCheckOutDateTime
//         )
//       ) {
//         return false; //Overlap found , do not book
//       }
//     }
//     //no overlaps found, room is available
//     return true;
//   } catch (error) {
//     console.log("Failed to check Availability", error);
//     return {
//       error: "Failed to check room availability. Please try again later.",
//     };
//   }
// }

// export default checkRoomAvailability;
