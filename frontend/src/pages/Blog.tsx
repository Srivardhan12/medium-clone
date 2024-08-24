/* eslint-disable  */
import { useParams } from "react-router-dom";
import { GetBlog } from "../hooks";
import { FullBlog } from "./FullBlog";
import Appbar from "../components/Appbar";
import FullBlogSkeleton from "../components/FullBlogSkeleton";

export const Blog = () => {
    const { id } = useParams()
    const { loding, blog } = GetBlog({ id: id || "" })

    if (loding) {
        return <div>
            <FullBlogSkeleton />
        </div>
    }

    return <div>
        <Appbar />
        {/* @ts-expect-error  */}
        <FullBlog blog={blog} />
    </div>
}