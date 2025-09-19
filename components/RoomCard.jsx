"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import BookingForm from "@/components/BookingForm";
import { getBookedDates } from "@/app/actions/getBookedDates";
import { FiCalendar, FiUsers, FiMapPin, FiCheckCircle } from "react-icons/fi";

const RoomCard = ({ room }) => {
  const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
  const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  const imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`;
  const imageSrc = room.image ? imageUrl : "/images/no-image.jpg";

  const [showBooking, setShowBooking] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- ANIMATION STATE ---
  // This state controls the CSS classes for the enter/exit animation.
  const [isAnimating, setIsAnimating] = useState(false);

  // This useEffect fetches data only when the modal is told to open.
  useEffect(() => {
    async function fetchDates() {
      if (!room?.$id) return;
      setIsLoading(true);
      setError(null);
      try {
        const dates = await getBookedDates(room.$id);
        setBookedDates(dates);
      } catch (err) {
        setError("Could not load booking information.");
        toast.error("Could not load booking information.");
      } finally {
        setIsLoading(false);
      }
    }

    if (showBooking) {
      fetchDates();
      // After the modal is added to the DOM, trigger the 'enter' animation
      setTimeout(() => setIsAnimating(true), 10);
    }
  }, [room?.$id, showBooking]);

  // --- ANIMATION HANDLER ---
  // This function handles the 'exit' animation before closing the modal.
  const handleCloseModal = () => {
    setIsAnimating(false); // Trigger the exit animation
    setTimeout(() => {
      setShowBooking(false); // Remove modal from DOM after animation (300ms)
    }, 300);
  };

  return (
    <>
      <Link href={`/rooms/${room.$id}`} className="block h-full">
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
          <div className="relative overflow-hidden rounded-t-xl">
            <Image
              src={imageSrc}
              width={400}
              height={225}
              alt={room.name}
              className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h4 className="text-lg font-bold text-white tracking-tight">
                {room.name}
              </h4>
              <div className="flex items-center mt-1 text-sm text-white/90">
                <FiMapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
                <span>{room.location}</span>
              </div>
            </div>
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <div className="flex-grow">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <FiUsers className="mr-3 h-4 w-4 flex-shrink-0 text-cyan-500" />
                  <span>
                    <span className="font-medium text-gray-800">Capacity:</span>{" "}
                    {room.capacity} People
                  </span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-3 h-4 w-4 flex-shrink-0 text-purple-500" />
                  <span>
                    <span className="font-medium text-gray-800">
                      Availability:
                    </span>{" "}
                    {room.availability}
                  </span>
                </div>
                <div className="flex items-start">
                  <FiCheckCircle className="mr-3 h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>
                    <span className="font-medium text-gray-800">
                      Amenities:
                    </span>{" "}
                    {room.amenities}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100">
              <button
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg text-center hover:bg-blue-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowBooking(true);
                }}
              >
                <FiCalendar />
                <span>Book Now</span>
              </button>
            </div>
          </div>
        </div>
      </Link>

      {showBooking && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleCloseModal}
        >
          <div
            className={`bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 mx-4 flex flex-col relative max-h-[90vh] transform transition-all duration-300 ${
              isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Book: {room.name}
              </h2>
              <button
                className="text-gray-500 p-2 rounded-full hover:bg-gray-100"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <svg
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
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
                <p className="ml-4 text-gray-600">Loading Calendar...</p>
              </div>
            ) : (
              <div className="overflow-y-auto">
                <BookingForm room={room} bookedDates={bookedDates} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RoomCard;
// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { toast } from "react-toastify";
// import BookingForm from "@/components/BookingForm";
// import { getBookedDates } from "@/app/actions/getBookedDates";

// // Icons for the UI
// import {
//   FiEye,
//   FiCalendar,
//   FiUsers,
//   FiMapPin,
//   FiCheckCircle,
// } from "react-icons/fi";

// const RoomCard = ({ room }) => {
//   const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
//   const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
//   const imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`;
//   const imageSrc = room.image ? imageUrl : "/images/no-image.jpg";

//   const [showBooking, setShowBooking] = useState(false);
//   const [bookedDates, setBookedDates] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchDates() {
//       if (!room?.$id) {
//         setIsLoading(false);
//         return;
//       }
//       try {
//         setIsLoading(true);
//         setError(null);
//         const dates = await getBookedDates(room.$id);
//         setBookedDates(dates);
//       } catch (err) {
//         setError("Could not load booking information. Please try again later.");
//         toast.error("Could not load booking information.");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchDates();
//   }, [room?.$id]);

//   return (
//     <>
//       <Link href={`/rooms/${room.$id}`} className="block h-full">
//         <div className="bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
//           <div className="relative overflow-hidden rounded-t-xl">
//             <Image
//               src={imageSrc}
//               width={400}
//               height={225}
//               alt={room.name}
//               className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//             <div className="absolute inset-x-0 bottom-0 p-4">
//               <h4 className="text-lg font-bold text-white tracking-tight">
//                 {room.name}
//               </h4>
//               <div className="flex items-center mt-1 text-sm text-white/90">
//                 <FiMapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
//                 <span>{room.location}</span>
//               </div>
//             </div>
//           </div>

//           <div className="p-4 flex flex-col flex-grow">
//             <div className="flex-grow">
//               <div className="space-y-2 text-sm text-gray-600">
//                 <div className="flex items-center">
//                   {/* COLOR CHANGE: Capacity icon is now a shade of cyan */}
//                   <FiUsers className="mr-3 h-4 w-4 flex-shrink-0 text-cyan-500" />
//                   <span>
//                     <span className="font-medium text-gray-800">Capacity:</span>{" "}
//                     {room.capacity} People
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   {/* COLOR CHANGE: Availability icon is now a shade of purple */}
//                   <FiCalendar className="mr-3 h-4 w-4 flex-shrink-0 text-purple-500" />
//                   <span>
//                     <span className="font-medium text-gray-800">
//                       Availability:
//                     </span>{" "}
//                     {room.availability}
//                   </span>
//                 </div>
//                 <div className="flex items-start">
//                   {/* COLOR CHANGE: Amenities icon is now a shade of green */}
//                   <FiCheckCircle className="mr-3 h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
//                   <span>
//                     <span className="font-medium text-gray-800">
//                       Amenities:
//                     </span>{" "}
//                     {room.amenities}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-5 pt-4 border-t border-gray-100">
//               <button
//                 className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg text-center hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   e.preventDefault();

//                   if (error) {
//                     toast.error(error);
//                   } else {
//                     setShowBooking(true);
//                   }
//                 }}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   "Loading..."
//                 ) : (
//                   <>
//                     <FiCalendar />
//                     <span>Book Now</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </Link>

//       {/* Booking Modal (remains unchanged) */}
//       {showBooking && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
//           onClick={() => setShowBooking(false)}
//         >
//           <div
//             className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 mx-4 flex flex-col relative max-h-[90vh]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4 border-b pb-4">
//               <h2 className="text-xl font-bold text-gray-800">
//                 Book: {room.name}
//               </h2>
//               <button
//                 className="text-gray-500 p-2 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors"
//                 onClick={() => setShowBooking(false)}
//                 aria-label="Close"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="overflow-y-auto">
//               <BookingForm room={room} bookedDates={bookedDates} />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default RoomCard;
