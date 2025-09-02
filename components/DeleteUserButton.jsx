"use client";

import { useTransition } from "react";
import deleteUser from "@/app/actions/deleteUser";
import { MdDelete } from "react-icons/md";

const DeleteUserButton = ({ user }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      startTransition(async () => {
        const result = await deleteUser(user);
        if (result.error) {
          alert(`Error: ${result.error}`);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
      aria-label="Delete User"
    >
      <MdDelete className="h-5 w-5" />
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteUserButton;
