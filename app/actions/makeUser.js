"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import checkAuth from "./checkAuth";

async function makeUser(userId) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("appwrite-session");

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    const { user } = await checkAuth();

    if (!user) {
      return { error: "You must be logged in to update roles." };
    }

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS,
      userId,
      {
        role: "user",
      }
    );

    revalidatePath("/users"); // adjust path accordingly

    return { success: true };
  } catch (error) {
    console.error("Failed to update role to user", error);
    return { error: "Failed to update role. Please try again later." };
  }
}

export default makeUser;
