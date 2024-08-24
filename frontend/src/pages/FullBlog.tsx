import { Blog } from "../hooks"
import { Icon } from "../components/Blog"

export const FullBlog = ({ blog }: { blog: Blog }) => {
    return <>
        <div className="flex justify-center pt-12">
            <div className="grid grid-cols-12 w-full max-w-screen-lg gap-10">
                <div className="col-span-8">
                    <div className="col-span-8">
                        <h2 className="text-5xl font-extrabold">{blog.title}</h2>
                        <p className="text-slate-500 pt-6 pl-2">{blog.content}</p>
                    </div>
                </div>
                <div className="col-span-4 pt-4">
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