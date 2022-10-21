function formatTimestamp(timestamp: number) {
  const eventDate = new Date(timestamp * 1);
  const options: object = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const eventDateStr = `${eventDate.toLocaleString("en-US", options)}`;
  return eventDateStr;
}

export default formatTimestamp;
