import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./userManagement.css";

export default function Dashboard() {
  const navigate = useNavigate();

  interface User {
    _id: string;
    name: string;
    emailId: string;
    role?: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const fetchLoggedInUser = async () => {
    const userString = localStorage.getItem("user");
    if (!userString || userString === "undefined") {
      console.error("No user found in storage.");
      return;
    }
    try {
      const currUser = JSON.parse(userString);
      const id = currUser._id;
      if (!id) {
        console.error("Please login");
        return;
      }
      const res = await fetch(`http://localhost:5000/getUser/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      const data = await res.json();
      setLoggedInUser(data.user || data);
    } catch (err) {
      console.error("failed to fetch log-in user context", err);
    }
  };

  const fetchUsers = async () => {
    const userString = localStorage.getItem("user");
    if (!userString || userString === "undefined") {
      console.error("No user found in storage. Please log in again.");
      return;
    }
    try {
      const userObj = JSON.parse(userString);
      const id = userObj._id || userObj.id;

      const response = await fetch(`http://localhost:5000/getAllUser/${id}`);
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType?.includes("application/json")) {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        return;
      }

      const data = await response.json();
      setUsers(data.getUser || []);
    } catch (err) {
      console.error("Failed to fetch all directory users:", err);
    }
  };

  useEffect(() => {
    fetchLoggedInUser();
    fetchUsers();
  }, []);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "" });

  const handleDelete = async (targetId: string) => {
    if (window.confirm("Are you sure you want to delete this user securely?")) {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) return;
        const adminObj = JSON.parse(userString);
        const adminId = adminObj._id || adminObj.id;

        const response = await fetch(
          `http://localhost:5000/deleteUser/${adminId}/${targetId}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          setUsers(users.filter((u) => u._id !== targetId));
          alert("User record deleted from database successfully.");
        } else {
          const errorData = await response.json();
          alert(
            `Error: ${errorData.message || "Could not delete execution target"}`,
          );
        }
      } catch (err) {
        console.error("Delete call failed:", err);
        alert("System error processing user removal routing");
      }
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user._id);
    setEditForm({ name: user.name, role: user.role || "User" });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/updateUser/${editingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editForm.name,
            role: editForm.role,
          }),
        },
      );

      if (response.ok) {
        setUsers(
          users.map((u) =>
            u._id === editingId
              ? { ...u, name: editForm.name, role: editForm.role }
              : u,
          ),
        );
        setEditingId(null);
        alert("Internal ledger database records synchronized successfully!");
      }
    } catch (err) {
      alert("Operational error patch updating profile structural elements");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  if (!loggedInUser) {
    return (
      <div className="premium-loader-container">
        <div className="premium-spinner"></div>
        <p>Synchronizing Secure Framework...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="ambient-blur blur-one"></div>
      <div className="ambient-blur blur-two"></div>

      <nav className="fixed-navbar">
        <div className="nav-logo">
          CoreDash <span className="logo-badge">PRO</span>
        </div>

        <div className="nav-actions">
          <button className="logout-action-btn" onClick={handleLogout}>
            Logout
          </button>

          <button
            className="avatar-btn"
            onClick={handleProfileClick}
            aria-label="View user account metadata profile"
          >
            <div className="avatar-circle">
              {loggedInUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="tooltip">View Profile</span>
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-card animated-border-box">
          <div className="glow-effect"></div>

          <div className="welcome-header-block">
            <h1 className="welcome-heading">
              Welcome Back,{" "}
              <span className="highlight-text">{loggedInUser.name}!</span>
            </h1>
          </div>

          <hr className="premium-divider" />

          <div className="directory-toolbar">
            <div className="toolbar-headline-meta">
              <h3>Team Directory</h3>
              <span className="user-count-indicator">
                Total: {users.length} {users.length === 1 ? "User" : "Users"}
              </span>
            </div>
          </div>

          {editingId && (
            <form
              onSubmit={handleUpdate}
              className="premium-glass-form animate-fade-in"
            >
              <h4>Modify System Account Profile Controls</h4>
              <div className="form-fields-grid">
                <div className="field-group">
                  <label>Full Structural Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="field-group">
                  <label>System Account Role Assignment Permission</label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                  >
                    <option value="Admin">Admin</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
              </div>
              <div className="form-actions-row">
                <button type="submit" className="form-submit-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="form-cancel-btn"
                  onClick={() => setEditingId(null)}
                >
                  Discard
                </button>
              </div>
            </form>
          )}

          <div className="users-scroll-window custom-scrollbar">
            {users.length === 0 ? (
              <div className="empty-directory-fallback">
                <p>
                  No account identities discovered in live database clusters.
                </p>
              </div>
            ) : (
              <div className="users-responsive-grid">
                {users.map((item) => {
                  const itemAvatarLetter = (item.name || "U")
                    .trim()
                    .charAt(0)
                    .toUpperCase();
                  const isAdmin = item.role?.toLowerCase() === "admin";

                  return (
                    <div
                      key={item._id}
                      className="user-premium-card animate-fade-in"
                    >
                      <div className="card-top-accent"></div>

                      <div className="card-user-info-row">
                        <div className="card-avatar-wrapper">
                          <div
                            className={`card-letter-avatar ${isAdmin ? "avatar-admin-gradient" : "avatar-user-gradient"}`}
                          >
                            {itemAvatarLetter}
                          </div>
                          <span
                            className="live-status-dot green-pulse"
                            title="System Node Online Connection Valid"
                          ></span>
                        </div>

                        <div className="card-identity-text-stack">
                          <h4 className="card-user-name" title={item.name}>
                            {item.name}
                          </h4>
                          <span
                            className={`role-badge ${isAdmin ? "badge-admin" : "badge-employee"}`}
                          >
                            {item.role || "User"}
                          </span>
                        </div>
                      </div>

                      <div className="card-meta-details-body">
                        <div className="meta-detail-row">
                          <span className="meta-detail-label">
                            Network Mailbox ID
                          </span>
                          <span
                            className="meta-detail-value"
                            title={item.emailId || "No Email"}
                          >
                            {item.emailId || "N/A"}
                          </span>
                        </div>
                        <div className="meta-detail-row">
                          <span className="meta-detail-label">
                            Hardware Hash Node
                          </span>
                          <span className="meta-detail-value code-hash-font">
                            {item._id ? `${item._id}` : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="card-actions-footer">
                        <button
                          className="action-btn-pill edit-pill"
                          onClick={() => startEdit(item)}
                        >
                          Modify
                        </button>
                        <button
                          className="action-btn-pill delete-pill"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete User
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
