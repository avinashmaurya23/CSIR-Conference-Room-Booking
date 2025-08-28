"use server";

import { createSessionClient } from "@/config/appwrite";
import { Query } from "node-appwrite";

/**
 * A security function that checks if the logged-in user is an admin.
 * It will throw an error if the user is not logged in or is not an admin,
 * halting the execution of any server action that calls it.
 */
async function ensureAdmin() {
  try {
    const { databases, account } = await createSessionClient();
    const authenticatedUser = await account.get();

    const { documents } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS,
      [Query.equal("user_id", authenticatedUser.$id)]
    );

    if (documents.length === 0) {
      throw new Error("User profile not found.");
    }

    const userProfile = documents[0];

    // THE CRITICAL CHECK:
    // If the user's role is not 'admin', stop everything.
    if (userProfile.role !== "admin") {
      throw new Error("Authorization failed: User is not an admin.");
    }

    // If the check passes, the function simply finishes.
    return;
  } catch (error) {
    // Re-throw the error to be caught by the server action
    throw new Error(error.message || "An authentication error occurred.");
  }
}

export default ensureAdmin;
