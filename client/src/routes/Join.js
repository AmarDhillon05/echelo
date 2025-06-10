import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Join() {
    //const dburi = process.env.DBAPI_URI
    const dburi = "http://localhost:2022/api"
   const navigate = useNavigate();

  async function create() {
    const pass = document.getElementById("joinPass").value;
    const error = document.getElementById("joinErr");

    if (pass !== document.getElementById("joinPassConf").value) {
      error.innerHTML = "Passwords don't match";
    } else {
      const body = {
        username: document.getElementById("joinUsername").value,
        password: pass,
        email: document.getElementById("joinEmail").value,
      };
      if(body.username == "" || body.password == "" || body.email == ""){
        error.innerHTML = "Fill out all fields"
      }
      else{

        try {
          const { data } = await axios.post(dburi + "/users/create", body);
          

          if (!data.user) {
            document.getElementById("loginErr").innerHTML = data.error;
          } else {
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/dashboard");
          }
        } catch (err) {
          const message = err.response?.data?.error || "Something went wrong. Please try again.";
          document.getElementById("joinErr").innerHTML = message;
        }

      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-950">
      <div class="w-full text-left p-8">
        <h1 className="text-4xl text-white text-purple-300">
           <a href = "/">
                    <i className="fa-solid fa-ranking-star text-5xl mb-3 text-yellow-200 hover:text-white transition-all duration-750"></i>
            </a>
          ech<span className="text-purple-400 font-semibold">elo</span>n
        </h1>
      </div>
      <div className="h-full text-center w-1/4 mt-5">
        <h1 className="text-4xl font-medium text-white my-2 mb-10 text-left">
          Join the <span className="text-teal-300 font-bold">Race</span>.
        </h1>

        <div class = "text-left mb-2 text-2xl font-semibold">Username</div> 
        <input
          id="joinUsername"
          name="joinUsername"
          placeholder="e.g. spon96"
          className="p-2 border-2 rounded border-white bg-white text-slate-800 mb-6 outline-none w-full"
        ></input>
        <br />
        <div class = "text-left mb-2 text-2xl font-semibold">Email</div> 
        <input
          id="joinEmail"
          name="joinEmail"
          placeholder="example@umd.edu"
          className="p-2 border-2 rounded border-white bg-white text-slate-800 mb-6 outline-none w-full"
        ></input>
        <br />

        <div class = "text-left mb-2 text-2xl font-semibold">Password</div> 
        <input
          id="joinPass"
          name="joinPass"
          placeholder="••••••••••"
          className="p-2 border-2 rounded border-white bg-white text-slate-800 mb-6 outline-none w-full"
        ></input>
        <br />
        <div class = "text-left mb-2 text-2xl font-semibold">Confirm Password </div> 
        <input
          id="joinPassConf"
          name="joinPassConf"
          placeholder="••••••••••"
          className="p-2 border-2 rounded border-white bg-white text-slate-800 mb-4 outline-none w-full"
        ></input>
        <br />

        <button className="p-2 rounded bg-purple-500 text-slate-100 mt-6 font-bold outline-none w-full"
        onClick={() => {
          create()
        }}
        >
          Create an Account
        </button>


        <a href = "/login" className = "text-purple-500 italic transition-all duration-500 hover:text-purple-700">Not New? Login Here</a>

        <p className="text-red" id="joinErr"></p>
      </div>

      {/* <div className="w-1/2 flex flex-col justify-center items-center h-full bg-blue-500">
        <h1 className="text-4xl font-bold text-purple-400 my-2">
          Welcome Back.
        </h1>

        <input
          id="loginUsername"
          name="loginUsername"
          placeholder="Username"
          className="p-2 border-b-4 border-white bg-black mb-4 font-bold outline-none"
        ></input>

        <input
          id="loginPass"
          name="loginPass"
          placeholder="Password"
          className="p-2 border-b-4 border-white bg-black mb-4 font-bold outline-none"
        ></input>

        <button className="mt-5 p-2 m-2 bg-slate-100 text-purple-500 font-bold rounded hover:bg-purple-500 hover:text-white">
          Sign In
        </button>

        <p className="text-red" id="loginErr"></p>
      </div> */}
    </div>
  );
}
