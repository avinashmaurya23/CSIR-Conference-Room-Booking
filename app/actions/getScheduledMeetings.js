"use server";

import { createAdminClient } from "@/config/appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

async function getScheduledMeetings() {
  try {
    const { databases } = await createAdminClient();

    // Fetch rooms
    const { documents: meetings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      [Query.equal("booking_status", "Confirm")]
    );

    // Revalidate the cache for this path

    // revalidatePath("/", "layout");
    return meetings;
  } catch (error) {
    console.log("Failed to get meetings", error);
    redirect("/error");
  }
}

export default getScheduledMeetings;
