import React from "react";
import Heading from "@/components/Heading";
import getAllUser from "@/app/actions/getAllUser";
import UserCard from "@/components/UserCard";

const users = await getAllUser();

const ManageUsers = () => {
  return (
    <>
      <Heading title="Available Conference Rooms" />
      {users.length > 0 ? (
        users.map((user) => <UserCard user={user} key={user.$id} />)
      ) : (
        <p>NO rooms available</p>
      )}
    </>
  );
};

export default ManageUsers;
