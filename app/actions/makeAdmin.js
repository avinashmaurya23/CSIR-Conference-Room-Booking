"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import checkAuth from "./checkAuth";

async function makeAdmin(userId) {
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
        role: "admin",
      }
    );

    revalidatePath("/users"); // adjust path to where user list is shown

    return { success: true };
  } catch (error) {
    console.error("Failed to update role to admin", error);
    return { error: "Failed to update role. Please try again later." };
  }
}

export default makeAdmin;
