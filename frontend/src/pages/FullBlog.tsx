import { Blog } from "../hooks"
import { Icon } from "../components/Blog"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const FullBlog = ({ blog }: { blog: Blog }) => {
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <>
        <div className="flex justify-center sm:pt-12 pt-5 px-2">
            <div className="grid grid-cols-12 max-w-screen-lg sm:gap-10 gap-5">
                <div className="sm:md:col-span-8 col-span-12">
                    <div>
                        <h2 className="text-5xl font-extrabold">{blog.title}</h2>
                        <p className="text-slate-500 pt-6 pl-2">{blog.content}</p>
                    </div>
                </div>
                <div className="sm:md:col-span-4 col-span-12 sm:pt-4 px-3 py-5">
                    <p className="font-medium">Author</p>
                    <div className="flex gap-2 pt-2">
                        <Icon authorName={blog.author.name || "Anonymous"} />
                        <h5 className="text-xl font-bold">{blog.author.name || "Anonymous"}</h5>
                    </div>
                </div>
            </div>
        </div>
    </>
}