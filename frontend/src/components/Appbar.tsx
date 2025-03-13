import { Link } from "react-router-dom";

export default function Appbar() {
    return (
        <div className="flex justify-between w-full sm:md:px-10 px-2 py-2 border-b-2">
            <div className="flex justify-center">
                <Link to="/blogs">
                    <h2 className="font-bold text-3xl">Medium</h2>
                </Link>
            </div>
            <div className="flex justify-center">
                <Link to="/publish" className="flex flex-col justify-center">
                    <button className="bg-green-500 text-sm py-1 px-2 ml-2 rounded text-white">Write</button>
                </Link>
                <Link to="/" className="flex flex-col justify-center sm:mx-4 mx-1">
                    <button className="text-white bg-gray-800 text-sm py-1 px-2 ml-2 rounded" onClick={() => {
                        localStorage.setItem("token", "")
                    }}>Logout</button>
                </Link>
            </div>
        </div>
    )
}
