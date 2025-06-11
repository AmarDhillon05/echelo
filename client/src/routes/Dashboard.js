import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();

  const [leaderboardIds, setLeaderboardIds] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    let user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      user = JSON.parse(user);
      console.log(user);
      setLeaderboardIds(user.leaderboardIds);
      setSubmissions(user.submissions);
    }
  }, []);

  return (
    <div className="px-8 py-8">
      <Navbar></Navbar>
      <div className="flex flex-col justify-center items-center h-screen"></div>
    </div>
  );
}
