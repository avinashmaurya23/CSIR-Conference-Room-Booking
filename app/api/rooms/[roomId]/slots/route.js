import { NextResponse } from "next/server";
import { createAdminClient } from "@/config/appwrite";
import { Query } from "node-appwrite";

export async function GET(req, context) {
  // Correctly access roomId from context.params without await
  const { roomId } = context.params;
  const date = req.nextUrl.searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Date query param missing" },
      { status: 400 }
    );
  }

  try {
    const { databases } = await createAdminClient();

    // Query bookings overlapping the date
    const startDateTime = `${date}T00:00:00.000Z`; // Using .000Z for full ISO 8601 compliance
    const endDateTime = `${date}T23:59:59.999Z`;

    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      [
        Query.equal("room_id", roomId),
        Query.lessThanEqual("check_in", endDateTime),
        Query.greaterThanEqual("check_out", startDateTime),
      ]
    );

    // Return bookings with only relevant time ranges
    const result = bookings.map((booking) => ({
      check_in: booking.check_in,
      check_out: booking.check_out,
    }));

    return NextResponse.json(result);
  } catch (error) {
    // Log the error for easier debugging
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
