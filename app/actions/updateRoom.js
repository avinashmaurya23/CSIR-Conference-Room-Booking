// /app/actions/updateRoom.js
"use server";
import { createAdminClient } from "@/config/appwrite";
import checkAuth from "./checkAuth";
import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";

export default async function updateRoom(_, formData) {
  const { databases, storage } = await createAdminClient();

  const id = formData.get("id");
  const name = formData.get("name");
  const description = formData.get("description");

  if (!id || !name || !description) {
    return { error: "All fields are required." };
  }

  const { user } = await checkAuth();
  if (!user) return { error: "You must be logged in." };

  let imageID = null;
  const image = formData.get("image");

  try {
    if (image && image.size > 0 && image.name !== "undefined") {
      const response = await storage.createFile("rooms", ID.unique(), image);
      imageID = response.$id;
    }

    const updatePayload = {
      name,
      description,
      sqft: formData.get("sqft"),
      capacity: formData.get("capacity"),
      amenities: formData.get("amenities"),
      availability: formData.get("availability"),
      location: formData.get("location"),
    };
    if (imageID) updatePayload.image = imageID;

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
      id,
      updatePayload
    );

    revalidatePath("/rooms/my", "layout");
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      error: error?.response?.message || "Unexpected error occurred",
    };
  }
}
