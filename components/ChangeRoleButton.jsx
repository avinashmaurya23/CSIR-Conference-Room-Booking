"use client";

import { makeAdmin, makeUser } from "@/app/actions/changeRole";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ChangeRoleButton = ({ user }) => {
  const router = useRouter();

  const handleMakeAdmin = async () => {
    if (!confirm(`Are you sure you want to make ${user.name} an admin?`)) {
      return;
    }
    try {
      const result = await makeAdmin(user.$id);
      if (result.success) {
        toast.success("Role changed to Admin successfully");
        router.refresh(); // This updates the page data without a full reload
      } else {
        toast.error(result.error || "Failed to change role.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleMakeUser = async () => {
    if (
      !confirm(`Are you sure you want to change ${user.name} back to a user?`)
    ) {
      return;
    }
    try {
      const result = await makeUser(user.$id);
      if (result.success) {
        toast.success("Role changed to User successfully");
        router.refresh(); // This updates the page data
      } else {
        toast.error(result.error || "Failed to change role.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error occurred");
    }
  };

  // If the user is an admin, show the "Make User" button
  if (user.role === "admin") {
    return (
      <button
        onClick={handleMakeUser}
        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
      >
        Make User
      </button>
    );
  }

  // Otherwise, show the "Make Admin" button
  return (
    <button
      onClick={handleMakeAdmin}
      className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
    >
      Make Admin
    </button>
  );
};

export default ChangeRoleButton;
