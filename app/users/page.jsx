import React from "react";
import Heading from "@/components/Heading";
import getAllUser from "@/app/actions/getAllUser";
import UserCard from "@/components/UserCard";

const ManageUsers = async () => {
  const users = await getAllUser();
  return (
    <>
      <Heading title="All Users profile" />
      {users.length > 0 ? (
        users.map((user) => <UserCard key={user.$id} user={user} />)
      ) : (
        <p>NO rooms available</p>
      )}
    </>
  );
};

export default ManageUsers;
