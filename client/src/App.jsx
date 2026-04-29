import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TimeZoneList from "./components/TimeZoneList";
import LocationList from "./components/LocationList";
import Login from "./components/Login";
import Signup from "./components/Signup";
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
            {/* Show description only when logged in */}
            {user && <p>View, Add, Edit or Delete Timezones below.</p>}
          </div>

          {user && (
            <button
              onClick={logout}
              style={{ height: "fit-content", cursor: "pointer" }}
            >
              Logout
            </button>
          )}
        </header>

        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

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

            {/* Redirect home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
