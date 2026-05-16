import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Profile from "./profile";
import Dashboard from "./UserManagement";
import "./App.css";

function App() {
  // const navigate = useNavigate();

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="main-nav">
        {/* <button className="logout-btn" onClick={() => navigate("/")}>
          Logout
        </button>
         */}
      </nav>

      {/* Page Routing */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
