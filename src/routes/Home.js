

export default function Home(){
    return (
        <div className = "flex flex-col justify-center items-center h-screen">
            <h1 className = "text-4xl font-bold text-purple-400 my-2">Echelon</h1>
            <p className = "italic my-4">increasing the competition</p>

            <button className = "bg-purple-200 opacity-100 hover:opacity-50 transition-all ease-in border-purple-800 border-2 my-4 p-4 text-purple-700 italic">
                Start rating</button>

            <a href = "/join">
                <button className = "bg-blue-200 opacity-100 hover:opacity-50 transition-all ease-in border-blue-800 border-2 my-4 p-4 text-blue-700 italic">
                Join the platform</button>
            </a>

        </div>
    )
}