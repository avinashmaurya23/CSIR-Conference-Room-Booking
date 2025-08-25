"use server";
import { createAdminClient } from "@/config/appwrite";
import checkAuth from "./checkAuth";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";

async function createRoom(previousState, formData) {
  const { databases, storage } = await createAdminClient();

  const name = formData.get("name");
  const description = formData.get("description");

  if (!name || !description) {
    return {
      error: "All fields are required.",
    };
  }

  // Get account Instance
  const { account } = createAdminClient();

  try {
    // Check if user is authenticated
    const { user } = await checkAuth();
    if (!user) {
      return {
        error: "You must be logged in to create a room.",
      };
    }

    let imageID;
    const image = formData.get("image");

    if (image && image.size > 0 && image.name !== "undefined") {
      try {
        // Upload image to storage
        const response = await storage.createFile("rooms", ID.unique(), image);
        imageID = response.$id; // Store the file ID for the room document
      } catch (error) {
        console.log("Error uploading image:", error);
        return { error: "Failed to upload image. Please try again." };
      }
    } else {
      console.log("No image provided or image is invalid.");
    }

    // Create room logic here (e.g., save to database)
    const newRoom = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE, // Your database ID
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS, // Your collection ID
      ID.unique(),
      {
        user_id: user.id,
        name: formData.get("name"),
        description: formData.get("description"),
        sqft: formData.get("sqft"),
        capacity: formData.get("capacity"),
        ammenities: formData.get("ammenities"),
        availability: formData.get("availability"),
        image: imageID,
      }
    );

    revalidatePath("/", "layout"); // Revalidate the rooms page after creating a room

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating room:", error);
    const errorMessage = error.response.message || "unexpected error occurred";
    return {
      error: errorMessage,
    };
  }
}
export default createRoom;
