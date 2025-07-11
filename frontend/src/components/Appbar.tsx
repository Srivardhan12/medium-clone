import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const Appbar = () => {
    const { user, setUser } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = localStorage.getItem("user");
        if (loggedUser) {
            try {
                setUser(JSON.parse(loggedUser));
            } catch (e) {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [setUser])


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    const handleMyBlogs = () => {
        navigate("/my-blogs");
        setIsDropdownOpen(false);
    };

    return (
        <div className="border-b flex justify-between items-center px-5 py-4">
            <div
                className="text-2xl font-bold cursor-pointer"
                onClick={() => navigate("/")}
            >
                Bloger
            </div>
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <button
                            onClick={() => navigate("/publish")}
                            className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition-colors"
                        >
                            Write
                        </button>
                        <div className="relative">
                            <div
                                className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center cursor-pointer text-m font-semibold"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                {user.name
                                    ? user.name[0].toUpperCase()
                                    : user.email[0].toUpperCase()}
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                                    <button
                                        onClick={handleMyBlogs}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        Your Blogs
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : <>
                    <button
                        onClick={() => navigate("/signin")}
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-[#3a3a3a] transition-colors"
                    >
                        Log in
                    </button>
                </>}
            </div>
        </div>
    );
};
