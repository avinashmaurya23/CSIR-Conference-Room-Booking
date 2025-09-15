export function formatDateToYMD(date) {
  return date.toISOString().slice(0, 10);
}

export function formatDateTimeToLocalInput(dateTime) {
  return new Date(dateTime).toISOString().slice(0, 16);
}
