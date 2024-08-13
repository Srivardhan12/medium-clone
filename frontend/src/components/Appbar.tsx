import { Link } from "react-router-dom";

export default function Appbar() {
    return (
        <div className="flex justify-between w-full px-10 py-2 border-b-2">
            <div className="flex justify-center">
                <h2 className="font-bold text-3xl">Medium</h2>
            </div>
            <div className="flex justify-center">
                <button className="flex flex-col justify-center px-4"><Link to="/signin">Sign in</Link></button>
                <button type="button" className="flex flex-col text-white bg-gray-800 font-medium rounded-lg text-sm px-4 py-2 me-2"><Link to="/signup">Get Started</Link></button>
            </div>
        </div>
    )
}
