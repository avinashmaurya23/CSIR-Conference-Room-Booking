import React from "react";
import makeAdmin from "@/app/actions/makeAdmin";
import { toast } from "react-toastify";

const MakeAdminButton = ({ userId }) => {
  const handleMakeAdmin = async () => {
    if (
      !confirm("Are you sure you want to assign the role 'admin' to this user?")
    ) {
      return;
    }
    try {
      const result = await makeAdmin(userId);
      if (result.success) {
        toast.success("Role changed to Admin successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error occurred");
    }
  };
  return (
    <div className="flex space-x-2">
      <button
        onClick={handleMakeAdmin}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 transition"
      >
        Make Admin
      </button>
    </div>
  );
};

export default MakeAdminButton;
