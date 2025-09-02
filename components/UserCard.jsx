"use client";

import React from "react";
import ChangeRoleButton from "./ChangeRoleButton"; // Import the new combined button
import DeleteUserButton from "./DeleteUserButton";

const UserCard = ({ user }) => {
  return (
    <div className="bg-white shadow hover:shadow-md mx-4 xl:mx-auto max-w-7xl rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between sm:items-center">
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <div className="space-y-1">
          <h4 className="text-lg text-black font-semibold">{user.name}</h4>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">User ID: </span>
            {user.$id} {/* Using Appwrite's document ID */}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Role: </span>
            <span
              className={`font-bold capitalize ${
                user.role === "admin" ? "text-sky-600" : "text-amber-600"
              }`}
            >
              {user.role}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Email: </span>
            {user.email}
          </p>
        </div>
      </div>

      <div className="flex space-x-2 mt-4 sm:mt-0">
        {/* Replace the two old buttons with your single, smart component */}
        <ChangeRoleButton user={user} />
        <DeleteUserButton user={user} />
      </div>
    </div>
  );
};

export default UserCard;
