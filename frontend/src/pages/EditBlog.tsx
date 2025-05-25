/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Blog, GetBlog } from "../hooks";
import FullBlogSkeleton from "../components/FullBlogSkeleton";
import JoditEditor from "jodit-react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function EditBlog() {
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState("")
    const [btndisabled, setBtndisabled] = useState(false)
    const navigate = useNavigate()

    const { id } = useParams()
    const { loding, blog }: { loding: boolean, blog: Blog[] } = GetBlog({ id: id || "" })

    const updateBlog = () => {
        setBtndisabled(true);
        axios.put(`${BACKEND_URL}/api/v1/blog/update/${id}`, {
            title,
            content: content,
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            const id = response.data.id;
            navigate(`/blog/${id}`);
        }).catch(error => {
            console.error("Error updating blog:", error);
        }).finally(() => {
            setBtndisabled(false);
        });
    };

    const config = useMemo(() => ({
        placeholder: 'Start typings...'
    }),
        []
    );

    useEffect(() => {
        if (blog && typeof blog === "object" && "content" in blog) {
            // @ts-ignore
            setContent(blog.content || "");
            // @ts-ignore
            setTitle(blog.title)
        }
        window.scroll(0, 0)
    }, [blog]);

    if (loding) {
        return <FullBlogSkeleton />
    }
    return (
        <div>
            <input onChange={(e) => { setTitle(e.target.value) }} type="text" className="h-fit outline-none focus:border-none text-gray-900 text-4xl rounded-lg block w-full p-2.5  font-bold break-words" value={title} />
            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={newContent => setContent(newContent)}
            />
            <div className="px-2 flex justify-items-center items-center fixed sm:block bottom-0 right-0 py-3">
                <button disabled={btndisabled} onClick={updateBlog} className="text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg w-fit text-sm px-5 py-2.5 me-2 mb-2">Update
                    {
                        btndisabled ? <svg aria-hidden="false" role="status" className="inline w-4 h-4 ms-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                        </svg> : ""
                    }
                </button>
            </div>
        </div>
    )
}
