import React from "react";
import BookingForm from "@/components/BookingForm";
import getSingleRoom from "@/app/actions/getSingleRoom";
import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
// Using Fi icons for consistency and broader choice of modern icons
import {
  FiArrowLeft,
  FiUsers,
  FiMaximize,
  FiClipboard,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import { getBookedDates } from "@/app/actions/getBookedDates";
import ScheduledMeeting from "@/components/ScheduledMeeting";
import getBookingSchedule from "@/app/actions/getBookingSchedule";

const RoomPage = async ({ params }) => {
  const { id } = await params;
  const room = await getSingleRoom(id);

  if (!room) {
    return <Heading title="Room Not Found" />;
  }

  const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
  const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  const imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`;
  const imageSrc = room.image ? imageUrl : "/images/no-image.jpg";

  const bookedDates = await getBookedDates(id);
  const meetings = await getBookingSchedule(id);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 px-4 sm:px-6 lg:px-8 py-6">
      <main>
        <div className="bg-white shadow-lg border border-gray-100 rounded-xl p-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-8 group"
          >
            <FiArrowLeft
              className="mr-2 text-blue-500 group-hover:-translate-x-1 transition-transform"
              size={20}
            />
            Back to All Rooms
          </Link>

          <div className="flex flex-col sm:flex-row sm:space-x-8">
            <div className="w-full sm:w-1/2 flex items-center justify-center p-0">
              <Image
                src={imageSrc}
                alt={room.name}
                width={1000}
                height={700}
                className="w-full h-auto object-cover rounded-lg shadow-md"
                priority
              />
            </div>

            <div className="mt-6 sm:mt-0 sm:w-1/2">
              {/* CHANGE: Added 'text-center' to center the room name */}
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight text-center">
                {room.name}
              </h1>
              {/* CHANGE: Centered the description for consistency */}
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {room.description}
              </p>

              {/* CHANGE: Removed the "Room Details" h3 heading */}
              <ul className="space-y-4 text-gray-700 mt-8">
                <li className="flex items-center">
                  <FiMapPin className="mr-4 text-indigo-500" size={22} />
                  <span className="font-semibold text-gray-800 w-24">
                    Location:
                  </span>
                  <span className="ml-2">{room.location}</span>
                </li>
                <li className="flex items-center">
                  <FiMaximize className="mr-4 text-green-500" size={22} />
                  <span className="font-semibold text-gray-800 w-24">
                    Size:
                  </span>
                  <span className="ml-2">{room.sqft} sq ft</span>
                </li>
                <li className="flex items-center">
                  <FiUsers className="mr-4 text-purple-500" size={22} />
                  <span className="font-semibold text-gray-800 w-24">
                    Capacity:
                  </span>
                  <span className="ml-2">{room.capacity} people</span>
                </li>
                <li className="flex items-center">
                  <FiCalendar className="mr-4 text-orange-500" size={22} />
                  <span className="font-semibold text-gray-800 w-24">
                    Availability:
                  </span>
                  <span className="ml-2">{room.availability}</span>
                </li>
                <li className="flex items-center">
                  <FiClipboard className="mr-4 text-red-500" size={22} />
                  <span className="font-semibold text-gray-800 w-24">
                    Amenities:
                  </span>
                  <span className="ml-2">{room.amenities}</span>
                </li>
              </ul>
            </div>
          </div>

          <hr className="my-10 border-gray-200" />

          <BookingForm room={room} bookedDates={bookedDates} />
        </div>
      </main>

      <aside className="space-y-6 mt-12 lg:mt-0">
        <ScheduledMeeting meetings={meetings} />
      </aside>
    </div>
  );
};

export default RoomPage;

// import React from "react";
// import BookingForm from "@/components/BookingForm";
// import getSingleRoom from "@/app/actions/getSingleRoom";
// import Heading from "@/components/Heading";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   FaChevronCircleLeft,
//   FaUsers,
//   FaRulerCombined,
//   FaClipboardList,
// } from "react-icons/fa";
// import { MdEventAvailable } from "react-icons/md";
// import { getBookedDates } from "@/app/actions/getBookedDates";
// import { FiMapPin } from "react-icons/fi";
// import ScheduledMeeting from "@/components/ScheduledMeeting";
// import getScheduledMeetings from "@/app/actions/getScheduledMeetings";

// const RoomPage = async ({ params }) => {
//   const { id } = await params;
//   const room = await getSingleRoom(id);

//   if (!room) {
//     return <Heading title="Room Not Found" />;
//   }

//   const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
//   const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
//   const imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`;
//   const imageSrc = room.image ? imageUrl : "/images/no-image.jpg";

//   const bookedDates = await getBookedDates(id);
//   const meetings = await getScheduledMeetings();

//   return (
//     // This wrapper fixes the "black line" issue and adds some breathing room
//     <div className="bg-gray-50 py-10">
//       <div className="bg-white shadow-md border border-gray-200 rounded-lg mx-4 p-8 mt-4 xl:mx-auto max-w-7xl">
//         <Link
//           href="/"
//           className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-8"
//         >
//           <FaChevronCircleLeft className="mr-2" />
//           Back to All Rooms
//         </Link>

//         <div className="flex flex-col sm:flex-row sm:space-x-8">
//           {/* Image Section */}
//           <div className="w-full sm:w-1/2">
//             <Image
//               src={imageSrc}
//               alt={room.name}
//               width={1000}
//               height={700}
//               className="w-full h-auto object-cover rounded-lg"
//               priority
//             />
//           </div>

//           {/* Details Section */}
//           <div className="mt-6 sm:mt-0 sm:w-1/2">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {room.name}
//             </h1>

//             <p className="text-gray-700 leading-relaxed mb-6">
//               {room.description}
//             </p>

//             <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
//               Room Details
//             </h3>
//             <ul className="space-y-4 text-gray-700">
//               <li className="flex items-center">
//                 <FiMapPin className="mr-3 text-blue-500" size={20} />
//                 <span className="font-semibold text-gray-800">Location:</span>
//                 <span className="ml-2">{room.location}</span>
//               </li>
//               <li className="flex items-center">
//                 <FaRulerCombined className="mr-3 text-blue-500" size={20} />
//                 <span className="font-semibold text-gray-800">Size:</span>
//                 <span className="ml-2">{room.sqft} sq ft</span>
//               </li>
//               <li className="flex items-center">
//                 <FaUsers className="mr-3 text-blue-500" size={20} />
//                 <span className="font-semibold text-gray-800">Capacity:</span>
//                 <span className="ml-2">{room.capacity} people</span>
//               </li>
//               <li className="flex items-center">
//                 <MdEventAvailable className="mr-3 text-blue-500" size={20} />
//                 <span className="font-semibold text-gray-800">
//                   Availability:
//                 </span>
//                 <span className="ml-2">{room.availability}</span>
//               </li>
//               <li className="flex items-center">
//                 <FaClipboardList className="mr-3 text-blue-500" size={20} />
//                 <span className="font-semibold text-gray-800">Amenities:</span>
//                 <span className="ml-2">{room.amenities}</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         <hr className="my-8 border-gray-200" />

//         <BookingForm room={room} bookedDates={bookedDates} />
//       </div>
//       <aside className="space-y-6">
//         <ScheduledMeeting meetings={meetings} />
//         {/* You can add the calendar card here in the future and 'space-y-6' will space it out automatically */}
//       </aside>
//     </div>
//   );
// };

// export default RoomPage;
