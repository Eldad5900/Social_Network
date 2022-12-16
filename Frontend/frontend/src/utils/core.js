import { days, months, monthsShort } from "./constants.js";

export const formatDateTime = (date) => {
  if (!date) return "";
  const m = new Date(date);
  const dateString =
    m.getUTCDate() + " " + months[m.getUTCMonth()] + " " + m.getUTCFullYear();
  return dateString;
};

export const calculateDistance = (point1, point2) => {
  const p = 0.017453292519943295; // Math.PI / 180
  const cosinus = Math.cos;
  const a =
    0.5 -
    cosinus((point2.lat - point1.lat) * p) / 2 +
    (cosinus(point1.lat * p) *
      cosinus(point2.lat * p) *
      (1 - cosinus((point2.lng - point1.lng) * p))) /
      2;

  return (12742 * Math.asin(Math.sqrt(a))) / 0.621371; // 2 * R; R = 6371 km
};
