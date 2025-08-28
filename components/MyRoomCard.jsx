import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";
import DeleteRoomButton from "./DeleteRoomButton";

const MyRoomCard = ({ room }) => {
  // Image URL construction logic from your reference
  const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
  const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  const imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`;
  const imageSrc = room.image ? imageUrl : "/images/no-image.jpg";

  return (
    <div className="bg-white shadow-md border border-gray-200 hover:shadow-lg transition-shadow mx-4 xl:mx-auto max-w-7xl rounded-lg p-6 mt-4 flex flex-col sm:flex-row justify-between items-start">
      {/* Left Side: Image and Details */}
      <div className="flex flex-col sm:flex-row sm:space-x-6 w-full">
        <Image
          src={imageSrc}
          width={400}
          height={400}
          alt={room.name}
          className="w-full sm:w-40 h-40 object-cover rounded-lg mb-4 sm:mb-0 flex-shrink-0"
        />
        <div className="flex-grow space-y-2">
          <h4 className="text-xl font-bold text-gray-900">{room.name}</h4>
          <p className="text-sm text-gray-600 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-gray-400" /> {room.location}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <FaUsers className="mr-2 text-gray-400" /> Seating Capacity:{" "}
            {room.capacity}
          </p>
          <p className="text-sm text-gray-500 line-clamp-2">{room.amenities}</p>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex flex-col items-stretch sm:items-end w-full sm:w-auto mt-4 sm:mt-0 sm:ml-6 flex-shrink-0 space-y-2 sm:space-y-0 sm:space-x-2 sm:flex-row">
        <Link
          href={`/rooms/${room.$id}`}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <FaEye className="mr-2" /> View
        </Link>
        <Link
          href={`/rooms/edit/${room.$id}`} // Added Edit button
          className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          <FaEdit className="mr-2" /> Edit
        </Link>
        <DeleteRoomButton roomId={room.$id} />
      </div>
    </div>
  );
};

export default MyRoomCard;
