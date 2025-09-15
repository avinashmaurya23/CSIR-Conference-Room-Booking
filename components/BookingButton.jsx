"use client";

export default function BookingButton({ isBooked, onClick }) {
  const text = isBooked ? "Check Availability" : "Book Room";
  const styles = isBooked
    ? "bg-yellow-500 hover:bg-yellow-600"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <button
      className={`mt-4 w-full py-2.5 rounded-lg text-white font-semibold transition-colors ${styles}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
