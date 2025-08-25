"use server";
import { createAdminClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";

async function createSession(previousState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      error: "Please fill in all fields",
    };
  }

  //Get account instance
  const { account, databases } = await createAdminClient();

  try {
    //Create session
    const session = await account.createEmailPasswordSession(email, password);
    //  Fetch the user's profile from your database
    const userProfileResponse = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS,
      [Query.equal("user_id", session.userId)] // Find the profile matching the logged-in user's ID
    );

    if (userProfileResponse.documents.length === 0) {
      // It's good practice to destroy the session if the profile is missing
      await account.deleteSession("current");
      return {
        error: "Authentication successful, but user profile not found.",
      };
    }
    const userProfile = userProfileResponse.documents[0];
    //create cookie
    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(session.expire),
      path: "/",
    });
    return {
      success: true,
      user: userProfile,
    };
  } catch (error) {
    console.error("Authentication Error:", error);

    return {
      error: "Invalid email or password",
    };
  }
}
export default createSession;
