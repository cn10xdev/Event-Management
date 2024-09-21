export default function parseEventTime(eventTime) {
  const [day, time] = eventTime.split('-');
  return { day, time };
}
