"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import BookingForm from "@/components/BookingForm";
import { getBookedDates } from "@/app/actions/getBookedDates";

// Icons for the UI
import { FiEye, FiCalendar, FiUsers, FiMapPin } from "react-icons/fi";

const RoomCard = ({ room }) => {
  const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
  const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  const imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`;
  const imageSrc = room.image ? imageUrl : "/images/no-image.jpg";

  const [showBooking, setShowBooking] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDates() {
      if (!room?.$id) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const dates = await getBookedDates(room.$id);
        setBookedDates(dates);
      } catch (err) {
        setError("Could not load booking information. Please try again later.");
        toast.error("Could not load booking information.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDates();
  }, [room?.$id]);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
        {/* 1. Image */}
        <Image
          src={imageSrc}
          width={400}
          height={225}
          alt={room.name}
          className="w-full aspect-video object-cover rounded-t-lg"
        />

        <div className="p-5 flex flex-col flex-grow">
          {/* 2. Details Section */}
          <div className="flex-grow">
            {/* TWEAK: Added mb-2 for a little more space below the title. */}
            <h4 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
              {room.name}
            </h4>

            {/* TWEAK: Unified text color to text-gray-700 and icon color to text-gray-400 for consistency. */}
            <div className="space-y-2 mt-4 text-sm text-gray-700">
              <div className="flex items-center">
                <FiMapPin className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                <span>{room.location}</span>
              </div>
              <div className="flex items-center">
                <FiUsers className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                <span>{room.capacity} Seating Capacity</span>
              </div>
              <p className="pt-1">
                <span className="font-semibold text-gray-900">
                  Availability:
                </span>{" "}
                {room.availability}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Amenities:</span>{" "}
                {room.amenities}
              </p>
            </div>
          </div>

          {/* 3. Buttons Section */}
          {/* TWEAK: The button container is now a simple `flex` with a gap. This keeps the buttons side-by-side on all screen sizes. */}
          <div className="flex items-center space-x-3 mt-6">
            <Link
              href={`/rooms/${room.$id}`}
              // TWEAK: `w-full` is changed to `flex-1` so the button takes up half the space in the flex container.
              className="flex items-center justify-center gap-2 bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg flex-1 text-center hover:bg-gray-900 transition-colors"
            >
              <FiEye />
              <span className="font-semibold">View Room</span>
            </Link>
            <button
              // TWEAK: `w-full` is changed to `flex-1` here as well.
              className="flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg flex-1 text-center hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={() => {
                if (error) {
                  toast.error(error);
                } else {
                  setShowBooking(true);
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  <FiCalendar />
                  <span className="font-semibold">Book Room</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal (Functionality unchanged) */}
      {showBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm"
          onClick={() => setShowBooking(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 mx-4 flex flex-col relative max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Book: {room.name}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowBooking(false)}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto">
              <BookingForm room={room} bookedDates={bookedDates} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomCard;

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";

// const RoomCard = ({ room }) => {
//   const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
//   const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

//   const imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`;

//   const imageSrc = room.image ? imageUrl : "/images/no-image.jpg";

//   return (
//     <div className="bg-white shadow hover:shadow-md  mx-4 xl:mx-auto max-w-7xl rounded-lg p-4 mt-4   flex flex-col sm:flex-row justify-between  sm:items-center">
//       <div className="flex  flex-col sm:flex-row sm:space-x-4">
//         <Image
//           src={imageSrc}
//           width={400}
//           height={100}
//           alt={room.name}
//           className="w-full sm:w-32 sm:h-32 mb-3 sm:mb-0 object-cover rounded-lg"
//         />
//         <div className="space-y-1">
//           <h4 className="text-lg text-black font-semibold">{room.name}</h4>
//           <p className="text-sm text-gray-600">
//             <span className="font-semibold text-gray-800">Location:</span>
//             {room.location}
//           </p>
//           <p className="text-sm text-gray-600">
//             <span className="font-semibold text-gray-800"> Availability:</span>
//             {room.availability}
//           </p>
//           <p className="text-sm text-gray-600">
//             <span className="font-semibold text-gray-800"> Ammenities:</span>
//             {room.amenities}
//           </p>
//           <p className="text-sm text-gray-600">
//             <span className="font-semibold text-gray-800">
//               {" "}
//               Seating capacity:{" "}
//             </span>
//             {room.capacity}
//           </p>
//         </div>
//       </div>
//       <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:shrink-0 sm:space-x-2 mt-2 sm:mt-0">
//         <Link
//           href={`/rooms/${room.$id}`}
//           className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700"
//         >
//           View Room
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default RoomCard;
