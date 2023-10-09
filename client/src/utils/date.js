export function getNumericDate(value) {
  if (new Date(value).toString() !== "Invalid Date") {
    return new Intl.DateTimeFormat("uk-UA").format(new Date(value));
  }
  return value;
}

export function getDateInMilliseconds(value) {
  return +new Date(value);
}

export function getDateNow() {
  return +new Date();
}

export function getHumanDate(value) {
  return new Intl.DateTimeFormat("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function isMoreThanOneDay(date1, date2) {
  const diffInMilliseconds = Math.abs(new Date(date2) - new Date(date1));
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
  return diffInDays > 1;
}

export function isLessThanMonthAgo(value) {
  const date = new Date(value);
  const monthAgo = date.setMonth(date.getMonth(value) - 1);
  return +monthAgo > +new Date(value);
}

export function getOdbDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date)) return value;
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  return date.toLocaleString("uk-UA", options);
}
