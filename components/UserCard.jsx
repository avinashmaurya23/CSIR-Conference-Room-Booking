"use client";

import React, { useState } from "react";
import MakeUserButton from "./MakeUserButton";
import MakeAdminButton from "./MakeAdminButton";

const UserCard = ({ user }) => {
  return (
    <div className="bg-white shadow hover:shadow-md mx-4 xl:mx-auto max-w-7xl rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between sm:items-center">
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <div className="space-y-1">
          <h4 className="text-lg text-black font-semibold">{user.name}</h4>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">User id: </span>
            {user.user_id}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Role: </span>
            {user.role}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Email: </span>
            {user.email}
          </p>
        </div>
      </div>

      <div className="flex space-x-2 mt-4 sm:mt-0">
        <MakeUserButton userId={user.$id} />
        <MakeAdminButton userId={user.$id} />
      </div>
    </div>
  );
};

export default UserCard;
