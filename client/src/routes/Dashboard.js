import { useEffect, useState, useNavigate } from "react"

export default function Dashboard(){

    const [leaderboardIds, setLeaderboardIds] = useState([])
    const [submissions, setSubmissions] = useState([])

    const navigate = useNavigate(); 

    useEffect(() => {
        const user = localStorage.getItem("user")
        if(!user){
            navigate("/login")
        }
        else{
            setLeaderboardIds(user.leaderboardIds)
            setSubmissions(user.submissions)
        }
    }, [])

    return (
    <div className="flex flex-col justify-center items-center h-screen">

        <a href = "/" className = "float-left flex-left">
            <i class="fa-solid fa-ranking-star text-5xl mb-3 text-yellow-200"></i>
            <h1 className="text-5xl font-bold text-white text-purple-300">echelon</h1>
        </a>

   
    </div>
    )
}