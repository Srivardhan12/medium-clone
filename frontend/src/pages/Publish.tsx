import axios from "axios"
import { Appbar } from "../components/Appbar"
import { BACKEND_URL } from "../config"
import { useNavigate } from "react-router-dom"
import { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';

export const Publish = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [errorMsg, setErrorMsg] = useState("")

    const config = useMemo(() => ({
        placeholder: 'Start typings...'
    }),
        []
    );

    const [btndisabled, setBtndisabled] = useState(false)
    const [title, setTitle] = useState("")
    const navigate = useNavigate();
    console.log(content, content.length)
    const publishBlog = () => {
        function isContentEmpty(content: string) {
            const text = content.replace(/<[^>]*>/g, "").trim(); // strips all tags
            return text === ""; // true if no visible text
        }

        if (title.trim().length === 0 || isContentEmpty(content)) {
            setErrorMsg("Title or Content is Empty");
            return;
        }

        setBtndisabled(true);
        axios.post(`${BACKEND_URL}/api/v1/blog`, {
            title,
            content: content,
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            const id = response.data.id;
            navigate(`/blog/${id}`);
        })
    }
    return (
        <div>
            <Appbar />
            <div className="min-w-xl max-w-5xl mx-auto ">
                <p className="text-center bg-red-500 text-white">{errorMsg}</p>
                <div>
                    <input onChange={(e) => { setTitle(e.target.value), setErrorMsg("") }} type="text" className="h-fit outline-none focus:border-none text-gray-900 text-4xl rounded-lg block w-full p-2.5  font-bold break-words" required placeholder="Title" />
                    <div>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            config={config}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setContent(newContent), setErrorMsg("") }}
                        />
                    </div>
                </div>
            </div>
            <div className="px-2 flex justify-items-center items-center fixed sm:block bottom-0 right-0 py-3">
                <button disabled={btndisabled} onClick={publishBlog} className="text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg w-fit text-sm px-5 py-2.5 me-2 mb-2">Publish
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
