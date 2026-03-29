import { useState, useEffect, useCallback } from "react";
import * as api from "../api/timezoneAPI"; // * so can use same naming

export function useTimeZone() {
  const [timeZones, setTimeZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all
  const fetchTimeZones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getTimeZone();
      console.log("Full API Response:", res.data); // testing
      setTimeZones(res.data.data || res.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // auto
  useEffect(() => {
    fetchTimeZones();
  }, []);

  // Create
  const addTimeZone = async (data) => {
    setLoading(true);
    try {
      const res = await api.createTimeZone(data);
      const newEntry = res.data.data || res.data;
      setTimeZones((prev) => [newEntry, ...prev]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Update
  const updateTimeZone = async (id, data) => {
    setLoading(true);
    try {
      //fix for fields
      const { _id, __v, ...updateData } = data;

      const res = await api.updateTimeZoneById(id, updateData);
      const updatedEntry = res.data.data || res.data;

      setTimeZones((prev) =>
        prev.map((tz) => (tz._id === id ? updatedEntry : tz)),
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const removeTimeZone = async (id) => {
    setLoading(true);
    try {
      await api.deleteTimeZoneById(id);
      setTimeZones((prev) => prev.filter((tz) => tz._id !== id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    timeZones,
    loading,
    error,
    fetchTimeZones,
    addTimeZone,
    updateTimeZone,
    removeTimeZone,
  };
}
