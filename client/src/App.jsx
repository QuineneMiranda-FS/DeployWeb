import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TimeZoneList from "./components/TimeZoneList";
import LocationList from "./components/LocationList";
import Login from "./components/Login"; // You'll need to create this
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { logout, user } = useAuth();

  return (
    <Router>
      <div
        className="App"
        style={{ padding: "20px", fontFamily: "sans-serif" }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1>Global TimeZone Manager</h1>
            <p>View, Add, Edit or Delete Timezones below.</p>
          </div>
          {/* Show Logout button only if user is logged in */}
          {user && (
            <button onClick={logout} style={{ height: "fit-content" }}>
              Logout
            </button>
          )}
        </header>

        <main>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>
                    <TimeZoneList />
                    <LocationList />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
