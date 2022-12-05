const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getDayMonthYear(dateString: string) {
  let date = new Date(dateString);
  return `${
    MONTHS[date.getUTCMonth()]
  } ${date.getUTCDate()}, ${date.getFullYear()}`;
}

export function getTime(dateString: string) {
  let date = new Date(dateString);
  return `${
    date.getHours() ? date.getHours() % 12 : date.getHours() + 12
  }:${date.getMinutes()}:${date.getSeconds()} ${
    date.getHours() > 12 ? "PM" : "AM"
  }`;
}
