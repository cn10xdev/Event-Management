const padTwo = s => {
  s = s.toString();
  return s.length === 2 ? s : '0' + s;
};

export default function getDetailedDate(dateString) {
  const date = new Date(dateString);
  return `${padTwo(date.getDate())}/${padTwo(
    date.getMonth() + 1
  )}, ${date.getHours()}:${padTwo(date.getMinutes())} `;
}
