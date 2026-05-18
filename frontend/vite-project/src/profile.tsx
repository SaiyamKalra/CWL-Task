import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";
export default function Profile() {
  interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    number: string;
  }
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
  const handleBack = () => {
    navigate("/users");
  };
  useEffect(() => {
    fetchLoggedInUser();
  }, []);
  if (isLoading) {
    return (
      <div className="failedLoggedInUser">
        <h4>You are not allowed in this website</h4>
      </div>
    );
  }
  if (!loggedInUser) {
    return (
      <div className="failedLoggedInUser">
        <h4 style={{ color: "#ef4444" }}>Access Denied. Please log in.</h4>
      </div>
    );
  }
  return (
    <div className="fullPage">
      <div className="alignMain">
        <div className="profileMain">
          <h4>{loggedInUser.name.charAt(0).toUpperCase()}</h4>
        </div>
      </div>
      <div className="card-box">
        <div className="card">
          <h4>{loggedInUser.name}</h4>
          <h4>{loggedInUser.email}</h4>
          <h4>{loggedInUser.number}</h4>
          <h4>{loggedInUser.role}</h4>

          <div className="button" onClick={handleBack}>
            <h4>Return to Dashboard</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
