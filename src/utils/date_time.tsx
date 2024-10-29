export const convertUtcDateToLocalTime = (utcTime: any) => {
  const utcDate = new Date(utcTime);

  const options = {
    timeZone: "Europe/Stockholm", // Set the time zone to Sri Lanka
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  } as Intl.DateTimeFormatOptions;
  console.log(options);
  const sriLankanTime = utcDate.toLocaleString("en-US", options);

  // Add 5 hours and 30 minutes to the time
  const sriLankanTimeWithOffset = new Date(
    utcDate.getTime() + (5 * 60 + 30) * 60 * 1000
  );

  return sriLankanTimeWithOffset.toLocaleString("en-US", options);
};

export const convertUtcTimeToLocalTime = (utcTime: any) => {
  const utcDate = new Date(utcTime);

  const options = {
    timeZone: "Europe/Stockholm", // Set the time zone to Sri Lanka
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use 12-hour format
  } as Intl.DateTimeFormatOptions;

  const sriLankanTime = utcDate.toLocaleString("en-US", options);

  // Add 5 hours and 30 minutes to the time
  const sriLankanTimeWithOffset = new Date(
    utcDate.getTime() + (5 * 60 + 30) * 60 * 1000
  );

  return sriLankanTimeWithOffset.toLocaleString("en-US", options);
};

export const convertTimeToStringAgo = (utcTime: any) => {
  const now: any = new Date();
  const postTime: any = new Date(utcTime);
  const diffInMs = now - postTime; // Difference in milliseconds
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // Convert to hours

  if (diffInHours < 1) {
    return "Posted just now";
  } else if (diffInHours === 1) {
    return "Posted 1 hour ago";
  } else {
    return `Posted ${diffInHours} hours ago`;
  }
};
