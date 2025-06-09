import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <i class="fa-solid fa-ranking-star text-5xl mb-3 text-yellow-200"></i>
      <h1 className="text-5xl font-bold text-white text-purple-300">echelon</h1>
      <p>elo rankings for everything.</p>

      <button
        onClick={() => navigate("/join")}
        className="mt-5 p-2 m-2 bg-slate-100 text-purple-500 rounded hover:bg-purple-500 hover:text-white font-bold"
      >
        {" "}
        Get Started{" "}
      </button>
    </div>
  );
}
