import React from "react";
import { useTimeZone } from "../hooks/useTimeZone";

function TimeZoneList() {
  const { timeZones, loading, error, removeTimeZone, addTimeZone } =
    useTimeZone();

  if (loading) return <p>Loading time zones...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Time Zone Manager</h1>
      <AddTimeZoneForm onAdd={addTimeZone} />

      {loading && <p>Syncing...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      <ul>
        {timeZones.map((tz) => (
          <li key={tz.id}>
            {tz.name}
            <button onClick={() => removeTimeZone(tz.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TimeZoneList;
