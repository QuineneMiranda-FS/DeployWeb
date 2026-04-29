import axios from "axios";
import api from "./axiosInstance";

export const getLocation = () => api.get("/locations");

export const getLocationById = (id) => api.get(`/locations/${id}`);

export const createLocation = (location) => api.post("/locations", location);

export const updateLocationById = (id, data) =>
  api.put(`/locations/${id}`, data);

export const deleteLocationById = (id) => api.delete(`/locations/${id}`);

export const getLocations = () => api.get("/locations");
