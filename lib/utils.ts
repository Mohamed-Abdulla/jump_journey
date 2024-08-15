export const getFormattedDate = () => {
  const today = new Date();
  const options = { weekday: "short", day: "2-digit", year: "numeric" };
  const formatter = new Intl.DateTimeFormat("en-US", options as any);
  return formatter.format(today);
};

export const getQuote = (totalCount: number) => {
  if (totalCount === 0) return "Let’s get started! Every jump counts!";
  if (totalCount < 100) return "Keep going!";
  if (totalCount < 200) return "You only did 100 😕 Keep pushing!";
  if (totalCount < 300) return "Not bad! You're making progress!";
  if (totalCount < 400) return "Great job! Keep it up!";
  if (totalCount < 500) return "Impressive! You're on fire!";
  if (totalCount < 600) return "Amazing effort! You're a champion!";
  return "Outstanding! You're a jump rope master!";
};

export const getCalendarFormat = () => {
  const date = new Date();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayName = dayNames[date.getDay()];
  const monthName = monthNames[date.getMonth()];
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${dayName} ${monthName} ${day} ${year}`;
};
