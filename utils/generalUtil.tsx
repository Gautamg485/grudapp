export const getCurrentTimeStamp = () => {
  const timestamp = new Date().getTime();

  return timestamp;
};

export const getFormattedDate = timestamp => {
  //   const timestamp = 1637978400000; // Example timestamp in milliseconds

  // Create a new Date object from the timestamp
  const date = new Date(timestamp);

  // Get the components of the date
  const year = date.getFullYear(); // 2021
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 11 (months are 0-indexed, so add 1)
  const day = String(date.getDate()).padStart(2, '0'); // 26
  const hours = String(date.getHours()).padStart(2, '0'); // 02
  const minutes = String(date.getMinutes()).padStart(2, '0'); // 00
  const seconds = String(date.getSeconds()).padStart(2, '0'); // 00

  // Combine components into a string in "YYYY-MM-DD HH:mm:ss" format
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
};

export const getDisplayDate = inputDateString => {
  // const inputDateString = "2021-11-26 02:00:00";

  // Convert the input string to a Date object
  const date = new Date(inputDateString);

  // Define an array of month names
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Get the components of the date
  const day = date.getDate(); // Day of the month (e.g., 26)
  const month = months[date.getMonth()]; // Month name (e.g., "November")
  const year = date.getFullYear(); // Year (e.g., 2021)

  // Combine into the desired format "26 November 2021"
  const formattedDate = `${day} ${month} ${year}`;

  return formattedDate;
};
