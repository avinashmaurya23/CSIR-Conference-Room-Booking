"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import checkAuth from "./checkAuth";

async function cancelBooking(bookingId) {
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
        error: "You must be logged in to cancel bookings",
      };
    }

    //Get the Booking
    const booking = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      bookingId // Assume bookingId is passed to this function
    );

    // Check if the booking belongs to the user

    // Delete the booking
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      bookingId
    );

    revalidatePath("/bookings"), "layout";
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Failed to cancel booking. Please try again later.",
    };
  }
}

export default cancelBooking;
