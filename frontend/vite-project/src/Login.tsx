import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [view, setView] = useState<"login" | "register">("login");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [role, setRole] = useState("employee");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailId, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login Successful!");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/users");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server is not responding");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          emailId: regEmail,
          password: regPassword,
          role,
        }),
      });
      const result = await response.text();
      if (response.ok) {
        alert("Registration Successful: " + result);
        setView("login");
      } else {
        alert("registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Server error during registration");
    }
  };
  return (
    <div className="container">
      <div className="auth-card">
        <div className="tabs">
          <button
            className={view === "login" ? "active" : ""}
            onClick={() => setView("login")}
          >
            Login
          </button>
          <button
            className={view === "register" ? "active" : ""}
            onClick={() => setView("register")}
          >
            Register
          </button>
        </div>

        {view === "login" ? (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email ID"
              required
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign In</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email ID"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
