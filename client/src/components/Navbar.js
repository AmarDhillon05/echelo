import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Navbar({addedClassList}){

    const navigate = useNavigate();

    const [user, setUser] = useState({})
    const [view, setView] = useState(false)
    
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")))
    }, [])

    return (
        <div className = {`flex flex-row w-full` + " " + addedClassList}>

            <div>
                <a href = "/">
                    <i className="fa-solid fa-ranking-star text-5xl mb-3 text-yellow-200 hover:text-white transition-all duration-750"></i>
                </a>
            </div>
            
            <div className = "ml-auto">

              <div className = "flex flex-col">
                <button className = "bg-black border-b-2 text-purple-400 font-bold border-gray-800 hover:border-purple-800 transition-all duration-500 px-2 py-2"
                onClick={() => {setView(!view)}}
                >{user.username}</button>


                <div className={`${view ? "max-h-[1000px]" : "max-h-0"} overflow-hidden transition-all duration-500 ease-in`}>
                    
                    <button className = "bg-black border-b-2 border-gray-800 hover:border-purple-800 transition-all duration-500 px-2 py-2"
                    onClick={() => {
                        localStorage.removeItem("user")
                        navigate("/login")
                    }}  
                    >Logout</button>

                </div>


              </div>

            </div>

        </div>
    )
}