import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AddLd from "../components/AddLd";

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
      <div className = "flex flex-row w-full px-8">
          <h1 className = "font-bold text-bold text-purple-500 text-2xl">Leaderboards</h1>
          <button className = "ml-auto p-4 bg-purple-500 font-bold text-bold text-2xl">+</button>
        </div>

        <AddLd exit = {(error) => {}}></AddLd> {/* This is gonna be a popup */}
    </div>
  );
}
