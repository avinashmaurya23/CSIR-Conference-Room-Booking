import React from "react";
import Heading from "@/components/Heading";
import BookedRoomCardAdmin from "@/components/BookedRoomCardAdmin";
import getNewBookings from "../actions/getNewBookings";

const RequestsPage = async () => {
  const bookings = await getNewBookings();
  return (
    <>
      <Heading title="New Bookings Requests" />
      {bookings.length === 0 ? (
        <p className="text-grey-600 mt-4"> You Have no bokings</p>
      ) : (
        bookings.map((booking) => (
          <BookedRoomCardAdmin key={booking.$id} booking={booking} />
        ))
      )}
    </>
  );
};

export default RequestsPage;
