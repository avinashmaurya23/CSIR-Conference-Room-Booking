import React from "react";

const UserCard = ({ user }) => {
  const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_USERS;
  const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

  return (
    <div className="bg-white shadow hover:shadow-md  mx-4 xl:mx-auto max-w-7xl rounded-lg p-4 mt-4   flex flex-col sm:flex-row justify-between  sm:items-center">
      <div className="flex  flex-col sm:flex-row sm:space-x-4">
        <div className="space-y-1">
          <h4 className="text-lg text-black font-semibold">{user.name}</h4>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">User id: </span>
            {user.user_id}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800"> Role: </span>
            {user.role}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800"> Email: </span>
            {user.email}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:shrink-0 sm:space-x-2 mt-2 sm:mt-0">
          <h1 className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700">
            View Room
          </h1>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
