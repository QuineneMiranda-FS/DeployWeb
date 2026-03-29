//this separates api calls from React
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTimeZone = () => api.get("/timeZone");

export const getTimeZoneById = (id) => api.get(`/timeZone/${id}`);

export const createTimeZone = (timeZone) => api.post("/timeZone", timeZone);

export const updateTimeZoneById = (id, timeZone) =>
  api.put(`/timeZone/${id}`, timeZone);

export const deleteTimeZoneById = (id) => api.delete(`/timeZone/${id}`);
