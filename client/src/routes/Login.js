import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Join() {
    //const dburi = process.env.DBAPI_URI
    const dburi = "http://localhost:2022/api"
  const navigate = useNavigate();

  async function login() {
    const body = {
      username: document.getElementById("loginUsername").value,
      password: document.getElementById("loginPass").value,
    };
    console.log(body);
    const { data } = await axios.post(
      dburi + "/users/sign-in",
      body
    );
    if (data.error) {
      document.getElementById("loginErr").innerHTML = data.error;
    } else {
      localStorage.setItem("user", data)
      navigate("/Rank");
    }
  }


  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-950">
      <div class="w-full text-left p-8">
        <h1 className="text-4xl text-white text-purple-300">
          <i class="fa-solid fa-ranking-star text-3xl mb-3 text-yellow-200 mr-4"></i>
          ech<span className="text-purple-400 font-semibold">elo</span>n
        </h1>
      </div>
      <div className="h-full text-center w-1/4 mt-5">
        <h1 className="text-4xl font-medium text-white my-2 mb-10 text-left">
          Welcome Back.
        </h1>

        <div class = "text-left mb-2 text-2xl font-semibold">Username</div> 
        <input
          id="loginUsername"
          name="loginUsername"
          className="p-2 border-2 rounded border-white bg-white text-slate-800 mb-6 outline-none w-full"
        ></input>

        <br />

        <div class = "text-left mb-2 text-2xl font-semibold">Password</div> 
        <input
          id="loginPass"
          name="loginPass"
          placeholder="••••••••••"
          type = "password"
          className="p-2 border-2 rounded border-white bg-white text-slate-800 mb-6 outline-none w-full"
        ></input>
        <br />
        

        <button className="p-2 rounded bg-purple-500 text-slate-100 mt-6 font-bold outline-none w-full"
        onClick={() => {
          login()
        }}
        >
          Login
        </button>

        <p className="text-red" id="loginErr"></p>

        <a href = "/join" className = "text-purple-500 italic transition-all duration-500 hover:text-purple-700">New? Join Here</a>
      </div>

    </div>
  );
}
