import { useState, useEffect } from "react";
import Image from "next/image";
import BookingForm from "./BookingForm"; // Adjust import path as needed
import { getBookedDates } from "@/app/actions/getBookedDates";
import { toast } from "react-toastify";

const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

// Helper function: Formats date string to "MMM D at h:mm AM/PM" in UTC
function formatBookingTime(dateString) {
  const date = new Date(dateString);
  const options = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC",
  };
  return new Intl.DateTimeFormat("en-US", options)
    .format(date)
    .replace(",", " at");
}

export default function AvailableRoomCard({
  room,
  bookingsForDate = [],
  onSelect,
}) {
  const [showBooking, setShowBooking] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDates() {
      if (!room?.$id) return;
      setIsLoading(true);
      setError(null);
      try {
        const dates = await getBookedDates(room.$id);
        setBookedDates(dates);
      } catch (err) {
        setError("Could not load booking information. Please try again later.");
        toast.error("Could not load booking information.");
        setBookedDates([]);
      } finally {
        setIsLoading(false);
      }
    }
    if (showBooking) {
      fetchDates();
    }
  }, [room?.$id, showBooking]);

  const imageUrl = room.image
    ? `https://nyc.cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`
    : "/images/no-image.jpg";

  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`Select room ${room.name} with capacity ${room.capacity} persons`}
      >
        <Image
          src={imageUrl}
          width={400}
          height={225}
          alt={room.name}
          className="w-full aspect-video object-cover rounded-t-lg"
          unoptimized={true}
        />
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold tracking-tight mb-1 text-gray-900">
            {room.name}
          </h3>
          <p className="text-gray-600 mb-2">{room.location}</p>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Availability: </span>
            {room.availability}
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Amenities: </span>
            {typeof room.amenities === "string"
              ? room.amenities
              : Array.isArray(room.amenities)
              ? room.amenities.join(", ")
              : ""}
          </p>
          <p className="text-gray-700 font-semibold">
            Seating Capacity: {room.capacity}
          </p>

          {bookingsForDate.length > 0 ? (
            <>
              <div className="mt-4 text-sm text-gray-700">
                <strong>Booked slots:</strong>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {bookingsForDate.map((booking) => (
                    <li key={booking.$id || booking.id}>
                      {`${formatBookingTime(
                        booking.check_in
                      )} - ${formatBookingTime(booking.check_out)} (${
                        booking.event_name || booking.title || "Booking"
                      })`}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="mt-4 w-full py-2 rounded bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
                onClick={() => setShowBooking(true)}
                disabled={isLoading}
              >
                Check Availability
              </button>
            </>
          ) : (
            <>
              <p className="mt-4 font-semibold text-green-600">
                Room is available whole day
              </p>
              <button
                className="mt-4 w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={() => setShowBooking(true)}
                disabled={isLoading}
              >
                Book Room
              </button>
            </>
          )}
          {error && <p className="mt-2 text-red-600 text-xs">{error}</p>}
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm"
          onClick={() => setShowBooking(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 mx-4 flex flex-col relative max-h-[90vh] overflow-y-auto"
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
            {isLoading ? (
              <div className="w-full py-8 flex justify-center items-center font-medium text-gray-500">
                Loading booking information...
              </div>
            ) : (
              <BookingForm room={room} bookedDates={bookedDates} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
