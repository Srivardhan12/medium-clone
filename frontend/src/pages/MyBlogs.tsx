import { Appbar } from "../components/Appbar";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import MyBlogsSkeleton from "../components/MyBlogsSkeleton";

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
    const { user } = useUser();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
        };

        if (user?.id) {
            fetchBlogs();
        }
    }, [user?.id]);

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
            <Appbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Your Blogs</h1>
                <p className="text-gray-600 mb-8">
                    Welcome {user?.name}! This is where you'll see all your published blogs.
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
                                <div
                                    key={blog.id}
                                    className="bg-white p-6 rounded-lg cursor-pointer border"
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
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}; 