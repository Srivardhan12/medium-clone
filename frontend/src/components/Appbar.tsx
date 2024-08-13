import { Link } from "react-router-dom";

export default function Appbar() {
    return (
        <div className="flex justify-between w-full px-10 py-2 border-b-2">
            <div className="flex justify-center">
                <h2 className="font-bold text-3xl">Medium</h2>
            </div>
            <div className="flex justify-center">
                <Link to="/signin"><button className="flex flex-col px-4">Sign in</button></Link>
                <Link to="/signup"><button type="button" className="text-white bg-gray-800 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2">Get Started</button></Link>
            </div>
        </div>
    )
}
