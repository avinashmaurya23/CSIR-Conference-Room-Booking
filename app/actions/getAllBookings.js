"use server";

import { createAdminClient } from "@/config/appwrite";
import { Query } from "node-appwrite";

async function getAllBookings() {
  try {
    const { databases } = await createAdminClient();
    // Fetch user bookings by the Admin
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      [Query.equal("booking_status", "Confirm")]
    );

    return bookings;
  } catch (error) {
    console.log("Failed to get bookings", error);
    return {
      error: "Failed to fetch bookings. Please try again later.",
    };
  }
}

export default getAllBookings;
