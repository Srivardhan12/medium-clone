import axios from "axios"
import Appbar from "../components/Appbar"
import { BACKEND_URL } from "../config"
import { useState } from "react"
// import { useNavigate } from "react-router-dom"

export const Publish = () => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    // const navigate = useNavigate();
    const publishBlog = () => {
        axios.post(`${BACKEND_URL}/api/v1/blog`, {
            title,
            content: description
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        // navigate("/blogs");
    }
    return (
        <div>
            <Appbar />
            <div className="flex min-w-xl max-w-5xl mx-auto ">
                <div className="mt-5">
                    <input onChange={(e) => { setTitle(e.target.value) }} type="text" className="outline-none focus:border-none text-gray-900 text-5xl rounded-lg block w-full p-2.5 font-bold" placeholder="Title" />
                    <textarea onChange={(e) => { setDescription(e.target.value) }} className="outline-none text-gray-900 text-md rounded-lg block w-full py-2.5 px-5" rows={30} placeholder="Tell tour story..." />
                </div>
                <div>
                    <button onClick={publishBlog} className="my-7 mx-20 text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Publish</button>
                </div>
            </div>
        </div>
    )
}
