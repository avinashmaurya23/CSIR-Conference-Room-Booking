import React from "react";
import BookingForm from "@/components/BookingForm";
import getSingleRoom from "@/app/actions/getSingleRoom";
import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
import { FaChevronCircleLeft } from "react-icons/fa";
import { getBookedDates } from "@/app/actions/getBookedDates";

const RoomPage = async ({ params }) => {
  const awaitedParams = await params; // Await the params promise
  const { id } = awaitedParams; // Now safely access id
  const room = await getSingleRoom(id);
  if (!room) {
    return <Heading title="Room Not Found" />;
  }
  const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
  const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

  const imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`;
  const imageSrc = room.image ? imageUrl : "/images/no-image.jpg";

  // Fetch booked dates for this room
  const bookedDates = await getBookedDates(id);

  return (
    <>
      <Heading title={room.name} />

      <div className="bg-white shadow-md rounded-lg mx-4  p-4 mt-4 xl:mx-auto  max-w-7xl">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <FaChevronCircleLeft className="inline mr-1" />
          <span className="ml-2">Back to Rooms</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:space-x-6 px-6">
          <Image
            src={imageSrc}
            alt={room.name}
            width={400}
            height={100}
            className="w-full sm:w-1/3 h-64 object-cover rounded-lg"
          />

          <div className="mt-4 sm:mt-0 sm:flex-1">
            <p className="text-gray-800 mb-4">{room.description}</p>

            <ul className="space-y-2">
              <li className="text-gray-600">
                <span className="font-semibold text-gray-800">Size:</span>{" "}
                {room.sqft} sq ft
              </li>
              <li className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Availability:{" "}
                </span>
                {room.availability}
              </li>
              {/* Removed price_per_hour as you no longer use it */}
              {/* <li className="text-gray-600">
                <span className="font-semibold text-gray-800">Price: </span>
                {room.price_per_hour} per hour
              </li> */}
              <li className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  ammenities:{" "}
                </span>{" "}
                {room.ammenities}
              </li>
            </ul>
          </div>
        </div>

        {/* Pass bookedDates as prop to BookingForm */}
        <BookingForm room={room} bookedDates={bookedDates} />
      </div>
    </>
  );
};

export default RoomPage;
