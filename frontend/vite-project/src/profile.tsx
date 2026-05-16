import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./userManagement.css"; // Reusing core CSS definitions

export default function Profile() {
  const navigate = useNavigate();

  interface user {
    _id: string;
    name: string;
    email: string;
    role?: string;
  }
  const [loggedInUser, setLoggedInUser] = useState<user | null>(null);
  const fetchLoggedInUser = async () => {
    const userString = localStorage.getItem("user");
    if (!userString || userString == "undefined") {
      console.error("User data not found please login");
      return;
    }
    try {
      const currUser = JSON.parse(userString);
      const id = currUser._id;
      if (!id) {
        console.log("User not found");
        return;
      }
      const res = await fetch(`http://localhost:5000/getUser/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Server respond with status ${res.status}`);
      }
      const data = await res.json();
      setLoggedInUser(data.user || data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchLoggedInUser();
  }, []);
  if (!loggedInUser) {
    return (
      <div
        className="dashboard-container"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div className="loading-spinner" style={{ color: "var(--text-main)" }}>
          Loading profile data...
        </div>
      </div>
    );
  }
  return (
    <div
      className="dashboard-container"
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div className="welcome-card" style={{ maxWidth: "460px" }}>
        <h2 className="welcome-heading" style={{ fontSize: "2rem" }}>
          {loggedInUser.name}'s Profile
        </h2>
        <h4 className="welcome-subtext">Email ID:- {loggedInUser.email}</h4>
        <h4 className="welcome-subtext" style={{ marginBottom: "2rem" }}>
          Role:- {loggedInUser.role}
        </h4>
        <button
          onClick={() => navigate("/users")}
          style={{
            background: "var(--accent-color)",
            color: "white",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
