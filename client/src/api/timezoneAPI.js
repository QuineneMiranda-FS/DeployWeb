//this separates api calls from React
import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

const api = axios.create({
  // This will use the Netlify variable in production or localhost in development
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
export const getTimeZone = () => api.get("/timezones");

export const getTimeZoneById = (id) => api.get(`/timezones/${id}`);

export const createTimeZone = (timeZone) => api.post("/timezones", timeZone);

export const updateTimeZoneById = (id, data) =>
  api.put(`/timezones/${id}`, data);

export const deleteTimeZoneById = (id) => api.delete(`/timezones/${id}`);

export const getLocations = () => api.get("/locations");
