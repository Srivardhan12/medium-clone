import { Appbar } from "../components/Appbar";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import MyBlogsSkeleton from "../components/MyBlogsSkeleton";
import Loader from "../components/Loader";

interface Blog {
    id: number;
    title: string;
    content: string;
    date: string;
    author: {
        name: string;
        id: number;
    };
}

export const MyBlogs = () => {
    const { user, setUser } = useUser();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [btndisabled, setBtndisabled] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${BACKEND_URL}/api/v1/blog/author/${user?.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                console.log("API Response:", response.data);
                if (response.data && response.data.blogs) {
                    setBlogs(response.data.blogs);
                } else {
                    setError("Invalid response format from server");
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setError("Failed to load blogs. Please try again.");
            } finally {
                setLoading(false);
            }
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
        };

        if (user?.id) {
            fetchBlogs();
        }
    }, [setUser, user?.id]);

    const deleteBlog = (id: number) => {
        const conformDelete = confirm("Are you sure want to delete the blog");
        if (!conformDelete) return
        setBtndisabled(true);
        window.scrollTo(0, 0);
        axios.delete(`${BACKEND_URL}/api/v1/blog/delete/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(() => {
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        }).catch(error => {
            console.error("Error deleting blog:", error);
        }).finally(() => {
            setBtndisabled(false);
        });
    }

    function extractTextFromHTML(htmlString: string) {
        const tempDiv: HTMLElement = document.createElement("div");
        tempDiv.innerHTML = htmlString;

        function getTextContent(node: Node): string {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.nodeValue ? node.nodeValue.trim() : "";
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                return Array.from(node.childNodes).map(getTextContent).join(" ").trim();
            }
            return "";
        }

        return getTextContent(tempDiv);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {btndisabled ? <Loader /> : ""}
            <Appbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Your Blogs</h1>
                <p className="text-gray-600 mb-8">
                    Welcome <span className="font-semibold">{user?.name}</span>! This is where you'll see all your published blogs.
                </p>

                {loading ? (
                    <div>
                        <MyBlogsSkeleton />
                        <MyBlogsSkeleton />
                        <MyBlogsSkeleton />
                        <MyBlogsSkeleton />
                        <MyBlogsSkeleton />
                        <MyBlogsSkeleton />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center">
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                ) : blogs.length === 0 ? (
                    <p className="text-gray-500">You haven't published any blogs yet.</p>
                ) : (
                    <div className="space-y-6">
                        {blogs.map((blog) => {
                            const clearContent = extractTextFromHTML(blog.content);
                            return (
                                <div className="bg-white p-6 rounded-lg cursor-pointer border">
                                    <div
                                        key={blog.id}
                                        onClick={() => navigate(`/blog/${blog.id}`)}
                                    >
                                        <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
                                        <p className="text-gray-600 mb-2 line-clamp-3">
                                            {/* {clearContent.length > 150 ? `${clearContent.substring(0, 150)}...` : clearContent} */}
                                            {clearContent}
                                        </p>
                                        <div className="text-sm text-gray-500">
                                            Published on {blog.date}
                                        </div>
                                    </div>
                                    <div className="flex mt-5 gap-5">
                                        <button className="bg-black text-white px-3 py-1 rounded-md hover:bg-[#3a3a3a] transition-colors" onClick={() => navigate(`/edit-blog/${blog.id}`)}>Edit</button>
                                        <button disabled={btndisabled} onClick={() => { deleteBlog(blog.id) }} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-400 transition-colors">Delete
                                            {/* {
                                                btndisabled ? <svg aria-hidden="false" role="status" className="inline w-4 h-4 ms-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                </svg> : ""
                                            } */}
                                        </button>
                                        {/* <button className="bg-black text-white px-3 py-1 rounded-md hover:bg-[#3a3a3a] transition-colors">Share</button> */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};