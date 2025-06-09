import { useNavigate } from "react-router-dom";

export default function Join(){

    const api_link = process.env.API_LINK
    const navigate = useNavigate();

    async function login(){
        const body = {
          username: document.getElementById("loginUsername").value,
          password: document.getElementById("loginPass").value,
        };
        console.log(body)
        const { data } = await axios.post(
          DBAPI_URI + '/users/sign-in',
          body
        );
        if(data.error){
            document.getElementById("loginErr").innerHTML = error
        }
        else{
            //Set in cache then
            navigate("/Rank")
        }
    }


    async function create(){
        const pass = document.getElementById("joinPass").value
        const error = document.getElementById("joinErr")
        if(pass != document.getElementById("joinPassConf").value){
            error.innerHTML = "Passwords don't match"
        }
        else{
            const body = {
            username: document.getElementById("joinUsername").value,
            password: pass,
            email: document.getElementById("joinEmail").value
          };
          const { data } = await axios.post(
            DBAPI_URI + "/users/create",
            body
          );
          if(data.error){
            error.innerHTML = error
          }
          else{
            //Set in cache then 
            navigate("/Rank")
          }
        }
    }

    return (
        <div className = "flex flex-row justify-center items-center h-screen">

            <div className = "flex flex-col justify-center items-center">
                <p className = "italic my-4">Want to play the game?</p>
                <h1 className = "text-4xl font-bold text-purple-400 my-2">Join</h1>

                <label for = "joinUsername">Username: </label>
                <input id = "joinUsername" name = "joinUsername" className = "p-2 border-2 border-white bg-black"></input>

                <label for = "joinEmail">Email: </label>
                <input id = "joinEmail" name = "joinEmail" className = "p-2 border-2 border-white bg-black"></input>

                <label for = "joinPass">Password: </label>
                <input id = "joinPass" name = "joinPass" className = "p-2 border-2 border-white bg-black"></input>

                <label for = "joinPassConf">Confirm Password: </label>
                <input id = "joinPassConf" name = "joinPassConf" className = "p-2 border-2 border-white bg-black"></input>

                <button className = "bg-purple-200 opacity-100 hover:opacity-50 transition-all ease-in border-purple-800 border-2 my-4 p-4 text-purple-700 italic">
                Join</button>

                <p className = "text-red" id = "joinErr"></p>
            </div>

            <div className = "w-1/4"></div>

            <div className = "flex flex-col justify-center items-center">
                <p className = "italic my-4">Already a customer?</p>
                <h1 className = "text-4xl font-bold text-purple-400 my-2">Login</h1>

                <label for = "loginUsername">Username: </label>
                <input id = "loginUsername" name = "loginUsername" className = "p-2 border-2 border-white bg-black"></input>

                <label for = "loginPass">Password: </label>
                <input id = "loginPass" name = "loginPass" className = "p-2 border-2 border-white bg-black"></input>

                <button className = "bg-purple-200 opacity-100 hover:opacity-50 transition-all ease-in border-purple-800 border-2 my-4 p-4 text-purple-700 italic">
                Join</button>

                <p className = "text-red" id = "loginErr"></p>
            </div>

        </div>
    )
}