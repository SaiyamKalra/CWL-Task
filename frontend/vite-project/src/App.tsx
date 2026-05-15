import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import { UserManagement } from "./UserManagement";
import "./App.css";

function App() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="main-nav">
        <div className="nav-links">
          <Link to="/">Home / Login</Link>
          <Link to="/users">User Management</Link>
        </div>
        <button className="logout-btn" onClick={() => navigate("/")}>
          Logout
        </button>
      </nav>

      {/* Page Routing */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </div>
  );
}

export default App;
