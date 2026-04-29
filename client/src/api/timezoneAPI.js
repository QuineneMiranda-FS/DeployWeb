//this separates api calls from React
import axios from "axios";
import api from "./axiosInstance";
// const api = axios.create({
//   baseURL: "http://localhost:3000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

export const getTimeZone = () => api.get("/timezones");
export const getLocations = () => api.get("/locations");
export const createTimeZone = (data) => api.post("/timezones", data);
export const updateTimeZoneById = (id, data) =>
  api.put(`/timezones/${id}`, data);
export const deleteTimeZoneById = (id) => api.delete(`/timezones/${id}`);
