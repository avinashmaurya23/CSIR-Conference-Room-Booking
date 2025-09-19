export default function ScheduledDatesSidebar({ bookings, selectedDate }) {
  const filteredBookings = selectedDate
    ? bookings.filter(
        (booking) => booking.check_in.slice(0, 10) === selectedDate // ISO date
      )
    : [];

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Scheduled Bookings</h2>
      {selectedDate ? (
        filteredBookings.length > 0 ? (
          <ul className="space-y-2">
            {filteredBookings.map((booking) => (
              <li key={booking.$id} className="text-sm">
                {booking.event_name} — {booking.check_in.slice(11, 16)} to{" "}
                {booking.check_out.slice(11, 16)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings on this date.</p>
        )
      ) : (
        <p>Select a date to see bookings.</p>
      )}
    </div>
  );
}
