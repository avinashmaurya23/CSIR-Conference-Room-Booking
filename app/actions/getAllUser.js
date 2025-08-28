"use server";

import { createAdminClient } from "@/config/appwrite";
import { redirect } from "next/navigation";

async function getAllUser() {
  try {
    const { databases } = await createAdminClient();

    const { documents: users } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS
    );

    // Revalidate the cache for this path

    // revalidatePath("/", "layout");

    return users;
  } catch (error) {
    console.log("Failed to get users", error);
    redirect("/error");
  }
}

export default getAllUser;
