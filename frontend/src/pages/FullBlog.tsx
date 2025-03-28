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
    }, [navigate])
    return <>
        <div className="flex justify-center px-2">
            <div className="max-w-screen-lg">
                <div className="py-3">
                    <p className="font-medium">Author</p>
                    <div className="flex gap-2 pt-2">
                        <Icon authorName={blog.author.name || "Anonymous"} />
                        <h5 className="text-xl font-bold">{blog.author.name || "Anonymous"}</h5>
                    </div>
                    <div className="w-full h-[0.9px] bg-gray-500 mt-5" />
                </div>
                <div>
                    <div>
                        <h2 className="text-5xl font-extrabold">{blog.title}</h2>
                        <iframe
                            className="h-screen"
                            title="content"
                            srcDoc={`
                                <html>
                                    <head>
                                        <style>
                                            body {
                                                font-family: system-ui;
                                                font-size: 16px;
                                                color: #000;
                                                margin: 0;
                                                padding: 10px;
                                            }
                                            ::-webkit-scrollbar {
                                                display: none;
                                            }
                                            html, body {
                                                scrollbar-width: none;
                                            }
                                        </style>
                                    </head>
                                    <body>
                                        ${blog.content}
                                        <p style="text-align:center; font-weight: 700;">THE END<p/>
                                    </body>
                                </html>
                            `}
                            width="100%"
                            style={{ border: "none", overflow: "hidden" }}
                        />
                    </div>
                </div>
            </div>
        </div>

    </>
}