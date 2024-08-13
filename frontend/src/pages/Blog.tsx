/* eslint-disable  */
import { useParams } from "react-router-dom";
import { GetBlog } from "../hooks";
import { FullBlog } from "../components/FullBlog";
import Appbar from "../components/Appbar";

export const Blog = () => {
    const { id } = useParams()
    const { loding, blog } = GetBlog({ id: id || "" })

    if (loding) {
        return <div>
            loding...
        </div>
    }

    return <div>
        <Appbar />
        {/* @ts-expect-error  */}
        <FullBlog blog={blog} />
    </div>
}