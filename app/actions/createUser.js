"use server";
import { createAdminClient } from "@/config/appwrite";
import { ID } from "node-appwrite";

async function createUser(previousState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const conformPassword = formData.get("confirm-password");

  if (!name || !email || !password) {
    return {
      error: "All fields are required.",
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 6 characters long.",
    };
  }
  if (password !== conformPassword) {
    return {
      error: "Passwords do not match.",
    };
  }

  //Get account Instance
  const { databases, account } = await createAdminClient();

  try {
    //crete user
    const user = await account.create(ID.unique(), email, password, name);

    const newUser = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE, // Replace with your database ID
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS, // Replace with your collection ID
      ID.unique(),
      {
        user_id: user.$id,
        role: "admin",
        email: email,
        name: name,
      }
    );
    return {
      success: true,
    };
  } catch (error) {
    console.log("Error creating user:", error);

    return {
      error: "Failed to create user. Please try again.",
    };
  }
}

export default createUser;
