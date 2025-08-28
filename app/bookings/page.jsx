import React from "react";
import Heading from "@/components/Heading";
import BookedRoomCard from "@/components/BookedRoomCard";
import getMyBookings from "../actions/getMyBookings";

const BookingsPage = async () => {
  const bookings = await getMyBookings();

  return (
    <>
      <Heading title="My Bookings" />
      {bookings.length === 0 ? (
        <p className="text-gray-600 mt-4 max-w-7xl mx-auto ">
          {" "}
          Sorry, You Have no bookings.
        </p>
      ) : (
        bookings.map((booking) => (
          <BookedRoomCard key={booking.$id} booking={booking} />
        ))
      )}
    </>
  );
};

export default BookingsPage;
