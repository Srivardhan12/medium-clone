import Appbar from "../components/Appbar";
import { DisplayBlog } from "../components/Blog"
import { useBlogs } from "../hooks"

export const Blogs = () => {
    const { loding, blogs } = useBlogs();

    if (loding == true) {
        return <div>
            <Appbar />
            loding...
        </div>
    }

    return <div>
        <Appbar />
        <div className="min-w-xl max-w-2xl mx-auto p-5">
            {blogs.map(blog => (<DisplayBlog id={blog.id} title={blog.title} content={blog.content} date="22 Dec 2024" authorName={blog.author.name || "Anonymous"} />))}
        </div>
    </div>
}