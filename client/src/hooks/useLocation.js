import { useState, useEffect, useCallback } from "react";

import * as api from "../api/locationAPI";
import * as tzApi from "../api/timezoneAPI";

export const useLocation = () => {
  const [locations, setLocations] = useState([]);
  const [timeZones, setTimeZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [locRes, tzRes] = await Promise.all([
        api.getLocations(),
        tzApi.getTimeZone(),
      ]);

      const rawLocs = locRes.data.data || [];
      const rawTzs = tzRes.data.data || [];

      // Link locations to timezone
      const enrichedLocs = rawLocs.map((loc) => {
        const tzMatch = rawTzs.find((tz) => tz.id === loc.timeZoneId);
        return {
          ...loc,
          tzName: tzMatch ? tzMatch.name : "N/A",
          tzFullName: tzMatch ? tzMatch.fullName : "Unknown",
        };
      });

      setLocations(enrichedLocs);
      setTimeZones(rawTzs);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const addLocation = async (locationData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.createLocation({
        ...locationData,
        fullCityName: `${locationData.cityName}, ${locationData.countryCode}`,
      });

      const newRecord = res.data.data || res.data;

      const tzMatch = timeZones.find(
        (tz) => (tz.id || tz._id) === newRecord.timeZoneId,
      );

      const enrichedRecord = {
        ...newRecord,
        tzName: tzMatch ? tzMatch.name : "N/A",
        tzFullName: tzMatch ? tzMatch.fullName : "Unknown",
      };

      setLocations((prev) => [enrichedRecord, ...prev]);
      return enrichedRecord;
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      console.error("Add Location Error:", serverMessage);
      setError(serverMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async (id, data) => {
    setLoading(true);
    try {
      const { _id, __v, ...payload } = data;

      const res = await api.updateLocationById(id, payload);
      const updatedRecord = res.data.data || res.data;

      setLocations((prev) =>
        prev.map((loc) =>
          loc._id === id ? { ...loc, ...updatedRecord } : loc,
        ),
      );
      return updatedRecord;
    } catch (err) {
      console.error("Update Location Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const removeLocation = async (id) => {
    setLoading(true);
    try {
      await api.deleteLocationById(id);
      setLocations((prev) => prev.filter((loc) => (loc._id || loc.id) !== id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    locations,
    timeZones,
    loading,
    error,
    addLocation,
    updateLocation,
    removeLocation,
    refresh: fetchAllData,
  };
};
