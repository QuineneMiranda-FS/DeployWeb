//this separates api calls from React
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTimeZone = () => api.get("/timezones");

export const getTimeZoneById = (id) => api.get(`/timezones/${id}`);

export const createTimeZone = (timeZone) => api.post("/timezones", timeZone);

export const updateTimeZoneById = (id, timeZone) =>
  api.put(`/timezones/${id}`, timeZone);

export const deleteTimeZoneById = (id) => api.delete(`/timezones/${id}`);
