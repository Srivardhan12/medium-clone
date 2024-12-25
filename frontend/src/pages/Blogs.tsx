import { useEffect } from "react";
import Appbar from "../components/Appbar";
import { DisplayBlog } from "../components/Blog"
import BlogSkeleton from "../components/BlogSkeleton";
import { useBlogs } from "../hooks"
import { useNavigate } from "react-router-dom";

export const Blogs = () => {
    const { loding, blogs } = useBlogs();

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    if (loding == true) {
        return <div>
            <Appbar />
            <div className="min-w-xl max-w-2xl mx-auto p-5">
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
            </div>
        </div>
    }

    return <div>
        <Appbar />
        <div className="min-w-xl max-w-2xl mx-auto p-5">
            {blogs.map(blog => (<DisplayBlog id={blog.id} title={blog.title} content={blog.content} key={blog.id} date={blog.date} authorName={blog.author.name || "Anonymous"} />))}
        </div>
    </div>
}