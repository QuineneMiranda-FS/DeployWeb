import React from "react";
import TimeZoneList from "./components/TimeZoneList";

function App() {
  return (
    <div className="App" style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <header>
        <h1>Global TimeZone Manager</h1>
        <p>Manage and view your saved time zones below.</p>
      </header>

      <main>
        <div>
          <TimeZoneList />
        </div>
      </main>
    </div>
  );
}

export default App;
