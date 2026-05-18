import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./userManagement.css";
export default function Dashboard() {
  interface User {
    _id: string;
    name: string;
    emailId: string;
    role: string;
    number: string;
  }
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modify, setModify] = useState(false);
  const [allUser, setAllUser] = useState<User[]>([]);
  const [isDashboardClicked, setIsDashboardClicked] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    role: "employee",
    number: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [addUserPage, setAddUserPage] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    emailId: "",
    password: "",
    role: "employee",
    number: "",
  });
  const fetchLoggedInUser = async () => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.error("user not logged in");
      setIsLoading(false);
      return;
    }
    try {
      const user = JSON.parse(userString);
      const userId = user._id || user.id;
      if (!userId) {
        console.error("User not logged in");
        setIsLoading(false);
        return;
      }
      const res = await fetch(`http://localhost:5000/getUser/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Server error");
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      const userData = data.user || data;
      setLoggedInUser(userData);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      return;
    }
  };

  const fetchAllLoggedInUser = async () => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.error("user not logged in");
      setIsLoading(false);
      return;
    }
    try {
      const user = JSON.parse(userString);
      const userId = user._id || user.id;
      if (!userId) {
        console.error("User not logged in");
        setIsLoading(false);
        return;
      }
      const userRole = user.role;
      if (userRole != "admin") {
        console.error("User not allowed to access this");
        setIsLoading(false);
        return;
      }
      const res = await fetch(`http://localhost:5000/getAllUser/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Server error");
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      setAllUser(data.getUser || data.users || data || []);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      return;
    }
  };
  const handleModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const res = await fetch(`http://localhost:5000/updateUser/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editForm.name,
          role: editForm.role,
          number: editForm.number,
        }),
      });
      if (res.ok) {
        setAllUser(
          allUser.map((u) =>
            u._id === editingId
              ? {
                  ...u,
                  name: editForm.name,
                  role: editForm.role,
                  number: editForm.number,
                }
              : u,
          ),
        );
        setEditingId(null);
        setModify(false);
      } else {
        console.error("Failed to update user database side");
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      return;
    }
  };
  const handleDelete = async (targetId: string) => {
    if (window.confirm("Are you sure you want to delete the account")) {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) {
          console.error("user not logged in");
          return;
        }
        const user = JSON.parse(userString);
        const userId = user._id || user.id;
        if (!userId) {
          console.error("User id not found");
          return;
        }
        const res = await fetch(
          `http://localhost:5000/deleteUser/${userId}/${targetId}`,
          {
            method: "DELETE",
          },
        );
        if (res.ok) {
          setAllUser(allUser.filter((u) => u._id !== targetId));
          console.log("User deleted successfully");
          return;
        } else {
          const errorData = await res.json();
          alert(`Error: ${errorData.message || "Could not delete"}`);
        }
      } catch (err) {
        console.error(err);
        return;
      }
    }
  };
  const handleAddNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.error("user not logged in");
      return;
    }
    try {
      const user = JSON.parse(userString);
      const userId = user._id || user.id;
      if (!userId) {
        console.error("user not found");
        return;
      }
      const res = await fetch(`http://localhost:5000/createUser/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        const data = await res.json();
        const savedUser = data.response || data.user || data;
        setAllUser([...allUser, savedUser]);
        console.log("User registered Successfully");
        setAddUserPage(false);
        setNewUser({
          name: "",
          emailId: "",
          password: "",
          role: "employee",
          number: "",
        });
      } else {
        const errorData = await res.json();
        alert(
          `Creation Failure: ${errorData.message || "Bad Request Context"}`,
        );
      }
    } catch (err) {
      console.error(err);
      return;
    }
  };
  const handleProfile = () => {
    navigate("/profile");
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  const handleDashboard = () => {
    setIsDashboardClicked(true);
  };
  useEffect(() => {
    fetchLoggedInUser();
    fetchAllLoggedInUser();
  }, []);
  if (isLoading) {
    return (
      <div className="failedLoggedInUser">
        <h4>You are not allowed in this website</h4>
      </div>
    );
  }
  return (
    <div className="FullPage">
      <div className="heading">
        <div className="title">
          <h4>CWL Project</h4>
        </div>
        <div className="profile-access">
          <div onClick={handleLogout}>
            <h4 className="logout">LOG OUT</h4>
          </div>
        </div>
        <div className="profile" onClick={handleProfile}>
          <h4>{loggedInUser.name.charAt(0).toUpperCase()}</h4>
        </div>
      </div>
      <div className="workspace">
        {loggedInUser!.role === "admin" && (
          <aside className="admin-sidebar">
            <div className="sidebarHeading">
              <h4>Admin Options</h4>
            </div>
            <div className="sidebarOption" onClick={handleDashboard}>
              <h4>Employees</h4>
            </div>
          </aside>
        )}
        <main className="main-content-alignment">
          <div className="alignMain">
            <div className="profileMain">
              <h4>{loggedInUser.name.charAt(0).toUpperCase()}</h4>
            </div>
            <div className="alignment">
              <div className="nameText">
                <h4>{loggedInUser.name}</h4>
              </div>

              <div>
                <div
                  onClick={() => {
                    setAddUserPage(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <h4>ADD</h4>
                </div>
              </div>
            </div>
            {!isDashboardClicked && (
              <div className="textAlignment">
                <p>Welcome to the dashboard</p>
              </div>
            )}
            {isDashboardClicked &&
              loggedInUser.role === "admin" &&
              (allUser.length == 0 ? (
                <div className="textAllignment">
                  <h4>User not found</h4>
                </div>
              ) : (
                <div className="card-grid">
                  {allUser.map((user) => {
                    return (
                      <div className="card" key={user._id}>
                        <h4>{user.name}</h4>
                        <h4>{user.emailId}</h4>
                        <h4>{user.number}</h4>
                        <h4>{user.role}</h4>
                        <div className="button-alignment">
                          <div
                            className="button"
                            onClick={() => {
                              setEditingId(user._id);
                              setEditForm({
                                name: user.name,
                                role: user.role,
                                number: user.number,
                              });
                              setModify(true);
                            }}
                          >
                            <h4>Modify</h4>
                          </div>

                          <div
                            className="button"
                            onClick={() => {
                              setDeleteAccount(true);
                              handleDelete(user._id);
                            }}
                          >
                            <h4>Delete User</h4>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

            {isDashboardClicked && loggedInUser.role === "employee" && (
              <div className="textAllignment">
                <h4>You are not allowed to access this</h4>
              </div>
            )}
          </div>
        </main>
      </div>
      {modify && (
        <div className="modal-overlay" onClick={() => setModify(false)}>
          <div
            className="modifyTabFloating"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Modify Employee</h3>
            <form onSubmit={handleModification}>
              <input
                type="text"
                value={editForm.name}
                placeholder={loggedInUser.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value,
                  })
                }
              ></input>
              <input
                type="number"
                value={editForm.number}
                placeholder={loggedInUser.number}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    number: e.target.value,
                  })
                }
              ></input>
              <input type="text" value={newUser.role} readOnly />

              <button type="submit">Save Changes</button>
              <button
                type="button"
                onClick={() => setModify(false)}
                style={{ height: "40px" }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {addUserPage && (
        <div className="modal-overlay" onClick={() => setAddUserPage(false)}>
          <div
            className="modifyTabFloating"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>New User</h3>
            <form onSubmit={handleAddNewUser}>
              <input
                type="text"
                value={newUser.name}
                placeholder="Enter the name...."
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    name: e.target.value,
                  })
                }
              ></input>
              <input
                type="text"
                value={newUser.emailId}
                placeholder="Enter the email..."
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    emailId: e.target.value,
                  })
                }
              ></input>
              <input
                type="text"
                value={newUser.password}
                placeholder="Enter the password..."
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    password: e.target.value,
                  })
                }
              ></input>
              <input
                type="number"
                value={newUser.number}
                placeholder="Enter the number..."
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    number: e.target.value,
                  })
                }
              ></input>
              <input type="text" value={newUser.role} readOnly />

              <button type="submit">Save</button>
              <button
                type="button"
                onClick={() => setAddUserPage(false)}
                style={{ height: "40px" }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
