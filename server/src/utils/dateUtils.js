export function startOfDay(date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function endOfDay(date) {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}
export const addHours = (date, hours) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

export function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export const getStartDateEndDate = ({ daysRange, fromDate = new Date() }) => {
  const start = startOfDay(fromDate);
  const end = endOfDay(addDays(fromDate, daysRange));
  return {
    start,
    end,
  };
};
export const formatDate = (date, langCode = "uk") => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Intl.DateTimeFormat(langCode, options)
    .format(date)
    .replace(/\//g, ".");
};
export function differenceInDays(date1, date2) {
  const oneDay = 1000 * 60 * 60 * 24;

  const date1InMs = startOfDay(new Date(date1)).getTime();
  const date2InMs = startOfDay(new Date(date2)).getTime();

  const differenceInMs = date1InMs - date2InMs;

  return Math.round(differenceInMs / oneDay);
}
export function differenceInMonths(startDateStr, endDateStr) {
  // Validate the date strings
  if (
    Number.isNaN(Date.parse(startDateStr)) ||
    Number.isNaN(Date.parse(endDateStr))
  ) {
    return "Invalid Date";
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Determine the order of dates and calculate the year and month differences
  const isStartDateLess = startDate < endDate;
  const start = isStartDateLess ? startDate : endDate;
  const end = isStartDateLess ? endDate : startDate;

  const yearsDifference = end.getFullYear() - start.getFullYear();
  let monthsDifference = end.getMonth() - start.getMonth();

  // Adjust for day differences to determine full months
  if (end.getDate() < start.getDate()) {
    monthsDifference -= 1;
  }

  // Calculate the total months difference
  const totalMonths = yearsDifference * 12 + monthsDifference;

  // Return the total months based on the original date order
  if (totalMonths === 0) {
    return 0;
  }
  return isStartDateLess ? totalMonths : -totalMonths;
}

export const createDateRange = (dateFrom, dateTo) => {
  const dateRange = [];
  const current = new Date(dateFrom);
  const end = new Date(dateTo);
  end.setHours(23, 59, 59, 999);

  while (current <= end) {
    dateRange.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dateRange;
};
