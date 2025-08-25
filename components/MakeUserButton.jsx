"use client";
import makeAdmin from "@/app/actions/makeAdmin";
import makeUser from "@/app/actions/makeUser"; // We'll create this next
import { toast } from "react-toastify";

const MakeUserButton = ({ userId }) => {
  // Handler to assign user role
  const handleMakeUser = async () => {
    if (
      !confirm("Are you sure you want to assign the role 'user' to this user?")
    ) {
      return;
    }
    try {
      const result = await makeUser(userId);
      if (result.success) {
        toast.success("Role changed to User successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleMakeUser}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 transition"
      >
        Make User
      </button>
    </div>
  );
};

export default MakeUserButton;
