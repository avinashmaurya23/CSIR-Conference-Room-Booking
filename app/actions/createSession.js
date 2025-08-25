"use server";
import { createAdminClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function createSession(previousState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      error: "Please fill in all fields",
    };
  }

  //Get account instance
  const { account } = await createAdminClient();

  try {
    //Create session
    const session = await account.createEmailPasswordSession(email, password);
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
    };
  } catch (error) {
    console.error("Authentication Error:", error);

    return {
      error: "Invalid email or password",
    };
  }
}
export default createSession;
