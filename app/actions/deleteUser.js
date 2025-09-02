"use server";

import { createAdminClient } from "@/config/appwrite";
import { revalidatePath } from "next/cache";

async function deleteUser(user) {
  console.log(user);
  const userId = user.$id;

  if (!userId) {
    return { success: false, error: "User ID is required." };
  }

  try {
    const { users, databases } = await createAdminClient();

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS,
      userId
    );
    console.log(userId.user_id);
    await users.delete(user.user_id);

    revalidatePath("/admin/manage-users");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    // CHANGE THIS LINE: Return the specific error message
    return {
      success: false,
      error: error.message || "An unknown error occurred.",
    };
  }
}

export default deleteUser;
