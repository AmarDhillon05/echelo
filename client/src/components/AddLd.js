import { useState } from "react"
import axios from "axios"

function requirement(name, type, requirements, setRequirements, key){
    return (
        <div className = "flex flex-row" key = {key}>
            <p className = "italic">{`${name} - ${type}`}</p>
            <button className = "bg-red text-xl bg-red-400 "
            onClick={() => {
                setRequirements(requirements.filter(x => x.name != name || x.type != type))
            }}
            >x</button>
        </div>
    )
}



export default function AddLd({exit}){

    const [requirements, setRequirements] = useState([])


    async function handleCreate(){
        const body = {
            "name" : document.getElementById("newLdName").value,
            "host" : JSON.parse(await localStorage.getItem("user")).username,
            "description" : document.getElementById("newLdDescr").value,
            "required": requirements
        }
        const { data } = await axios.post(dburi + "/leaderboard/createLeaderboard", body);
        if(data.error){
            exit(data.error)
        }
        else{
            exit(null)
        }

    }

    return (
        <div className = "h-1/2 flex flex-col">
            <h1 className = "text-2xl text-white font-bold">Create a leaderboard</h1>

            <label for = "newLdName">Name: </label>
            <input name = "newLdName" id = "newLdName" className = "border-2 border-gray-800 bg-black w-1/4"></input>

            <label for = "newLdDescr">Description: </label>
            <input name = "newLdDescr" id = "newLdDescr" className = "border-2 border-gray-800 bg-black h-3/4 w-3/4"></input>

            <p>Required fields: </p>
            {requirements.length == 0 ? <p className = "italic">No requiremnets yet</p> : 
                requirements.map((req, key) => {
                    return requirement(req.name, req.type, requirements, setRequirements, key)
                })
            }
            <div className = "flex flex-row">
                <p className = "mr-8">Add required fields: </p>

                <label for = "newReqName">Name: </label>
                <input name = "newReqName" id = "newReqName" className = "border-2 border-gray-800 bg-black w-1/4 mr-8"></input>

                <label for = "newReqType">Type: </label>
                <select name = "newReqType" id = "newReqType" className = "border-2 border-gray-800 bg-black w-1/4 mr-8">
                    <option value = "text">Text</option>
                    <option value = "image">Image</option>
                    <option value = "audio">Audio</option>
                    <option value = "video">Video</option>
                    <option value = "link">Link</option>
                </select>

                <button className = "border-2 border-purple-800 text-purple-800 p-4"
                onClick={() => {
                    const name = document.getElementById("newReqName").value
                    const type = document.getElementById("newReqType").value
                    if(name == "" || type == ""){
                        document.getElementById("reqErrText").innerHTML = "Fill out all fields"
                    }
                    else{
                        const allNames = requirements.map(x => x.name)
                        if(allNames.includes(name)){
                            document.getElementById("reqErrText").innerHTML = "No duplicates allowed"
                        }
                        else{
                            document.getElementById("reqErrText").innerHTML = ""
                            setRequirements([...requirements, {name, type}])
                        }
                    }
                }}
                >Add</button>
                <p className = "text-red-500 italic" id = "reqErrText"></p>
            </div>

            <button className = "border-2 border-purple-800 bg-purple-500 text-purple-800 p-4"
            onClick={handleCreate}
            >Create Leaderboard</button>

        </div>
    )
}