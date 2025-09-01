"use server";
import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

import { Query } from "node-appwrite";

async function checkAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("appwrite-session");

  if (!sessionCookie) {
    return {
      isAuthenticated: false,
    };
  }

  try {
    const { databases, account } = await createSessionClient(
      sessionCookie.value
    );

    const user = await account.get();

    async function getUser() {
      const { documents: users } = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS,
        [Query.equal("user_id", user.$id)] // Make sure "user_id" matches your exact attribute name
      );
      return users;
    }

    const [users] = await getUser(); // Await here to get actual docs

    return {
      isAuthenticated: true,
      user: {
        id: users.user_id,
        name: users.name,
        email: users.email,
        role: users.role,
      },
    };
  } catch (error) {
    return {
      isAuthenticated: false,
    };
  }
}

export default checkAuth;
