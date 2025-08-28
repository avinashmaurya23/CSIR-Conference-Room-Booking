import React from "react";
import Image from "next/image";
import Link from "next/link";

const RoomCard = ({ room }) => {
  const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
  const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

  const imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`;

  const imageSrc = room.image ? imageUrl : "/images/no-image.jpg";

  return (
    <div className="bg-white shadow hover:shadow-md  mx-4 xl:mx-auto max-w-7xl rounded-lg p-4 mt-4   flex flex-col sm:flex-row justify-between  sm:items-center">
      <div className="flex  flex-col sm:flex-row sm:space-x-4">
        <Image
          src={imageSrc}
          width={400}
          height={100}
          alt={room.name}
          className="w-full sm:w-32 sm:h-32 mb-3 sm:mb-0 object-cover rounded-lg"
        />
        <div className="space-y-1">
          <h4 className="text-lg text-black font-semibold">{room.name}</h4>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Location:</span>
            {room.location}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800"> Availability:</span>
            {room.availability}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800"> Ammenities:</span>
            {room.amenities}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">
              {" "}
              Seating capacity:{" "}
            </span>
            {room.capacity}
          </p>
          {/* <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800"> Price:</span>
              ${room.price_per_hour} per hour
            </p>  */}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:shrink-0 sm:space-x-2 mt-2 sm:mt-0">
        <Link
          href={`/rooms/${room.$id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700"
        >
          View Room
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
