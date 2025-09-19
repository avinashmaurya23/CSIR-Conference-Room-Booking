"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { redirect } from "next/navigation";
import checkAuth from "./checkAuth";
import { revalidatePath } from "next/cache";
import checkRoomAvailability from "./checkRoomAvailability";

async function bookRoom(previousState, formData) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("appwrite-session");

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    // get User ID
    const { user } = await checkAuth();

    if (!user) {
      return {
        error: "You must be logged in to book a room.",
      };
    }
    //extract date and time from the formData
    const checkInDate = formData.get("check_in_date");
    const checkInTime = formData.get("check_in_time");
    const checkOutDate = formData.get("check_out_date");
    const checkOutTime = formData.get("check_out_time");
    const eventName = formData.get("event_name");
    const roomId = formData.get("room_id");
    const attendees = Number(formData.get("attendees"));

    // combine date and time to ISO 8601 format
    const checkInDateTime = `${checkInDate}T${checkInTime}`;
    const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;

    //Check if room is available
    const availabilityResult = await checkRoomAvailability(
      roomId,
      checkInDateTime,
      checkOutDateTime
    );

    // If not available, forward the specific error message
    if (!availabilityResult.available) {
      return {
        error: availabilityResult.error,
      };
    }

    // Prepare booking data, including the new status
    const bookingData = {
      check_in: checkInDateTime,
      check_out: checkOutDateTime,
      user_id: user.id,
      user_name: user.name,
      room_id: roomId,
      event_name: eventName,
      attendees: attendees,
      booking_status: "Pending", // Set default status for new bookings
    };

    //Create booking
    const newBooking = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE, // Replace with your database ID
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS, // Replace with your collection ID
      ID.unique(),
      bookingData
    );

    //revalidate cache
    revalidatePath("/bookings", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.log("Failed to book rooms", error);
    return {
      error: "Failed to book rooms. Please try again later.",
    };
  }
}

export default bookRoom;

// "use server";

// import { createSessionClient } from "@/config/appwrite";
// import { cookies } from "next/headers";
// import { ID } from "node-appwrite";
// import { redirect } from "next/navigation";
// import checkAuth from "./checkAuth";
// import { revalidatePath } from "next/cache";
// import checkRoomAvailability from "./checkRoomAvailability";

// async function bookRoom(previousState, formData) {
//   const cookieStore = await cookies();
//   const sessionCookie = cookieStore.get("appwrite-session");

//   if (!sessionCookie) {
//     redirect("/login");
//   }

//   try {
//     const { databases } = await createSessionClient(sessionCookie.value);
//     // get User ID
//     const { user } = await checkAuth();
//     console.log("User ID:", user.name);

//     if (!user) {
//       return {
//         error: "You must be logged in to book a room.",
//       };
//     }
//     //extract date and time form the formData
//     const checkInDate = formData.get("check_in_date");
//     const checkInTime = formData.get("check_in_time");
//     const checkOutDate = formData.get("check_out_date");
//     const checkOutTime = formData.get("check_out_time");
//     const eventName = formData.get("event_name");
//     const roomId = formData.get("room_id");
//     // combine date and time to ISO 8601 format

//     const checkInDateTime = `${checkInDate}T${checkInTime}`;
//     const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;

//     console.log(checkInDate);
//     console.log(checkInTime);
//     console.log(checkOutDate);
//     console.log(checkOutTime);
//     console.log(checkInDateTime);

//     //Check if room is available
//     const isAvailable = await checkRoomAvailability(
//       roomId,
//       checkInDateTime,
//       checkOutDateTime
//     );

//     if (!isAvailable) {
//       return {
//         error: "The room is not available for the selected dates.",
//       };
//     }
//     // Prepare booking data
//     const bookingData = {
//       check_in: checkInDateTime,
//       check_out: checkOutDateTime,
//       user_id: user.id,
//       user_name: user.name,
//       room_id: roomId,
//       event_name: eventName,
//     };

//     //Create booking
//     const newBooking = await databases.createDocument(
//       process.env.NEXT_PUBLIC_APPWRITE_DATABASE, // Replace with your database ID
//       process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS, // Replace with your collection ID
//       ID.unique(),
//       bookingData
//     );

//     //revalidate cache
//     revalidatePath("/bookings", "layout");

//     return {
//       success: true,
//     };
//   } catch (error) {
//     console.log("Failed to book rooms", error);
//     return {
//       error: "Failed to book rooms. Please try again later.",
//     };
//   }
// }

// export default bookRoom;
