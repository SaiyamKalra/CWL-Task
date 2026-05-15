import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  emailId: string;
  role: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
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
      console.error("Failed to fetch:", err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "" });

  // --- MOCK ACTIONS ---
  const handleDelete = async (targetId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
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
          alert("User deleted successfully!");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message || "Could not delete"}`);
        }
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Error deleting user");
      }
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user._id);
    setEditForm({ name: user.name, role: user.role });
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
        alert("User updated successfully!");
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="manage-container">
      <h2>User Management</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              {editingId === user._id ? (
                // Edit Mode Row
                <>
                  <td>
                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </td>
                  <td>{user.emailId}</td>
                  <td>
                    <select
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="employee">Employee</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={handleUpdate} className="btn-save">
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                // Display Mode Row
                <>
                  <td>{user.name}</td>
                  <td>{user.emailId}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => startEdit(user)}
                      className="btn-edit"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
