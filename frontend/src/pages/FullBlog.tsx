import { Blog } from "../hooks"
import { Icon } from "../components/Blog"
import { useEffect } from "react";

export const FullBlog = ({ blog }: { blog: Blog }) => {

    useEffect(() => {
        window.scroll(0, 0)
    }, []);

    return <>
        <div className="flex justify-center px-2">
            <div className="w-4/6">
                <div className="py-3">
                    <p className="font-medium">Author</p>
                    <div className="flex gap-2 pt-2 items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <Icon authorName={blog.author.name || "Anonymous"} />
                            <h5 className="text-xl font-bold">{blog.author.name || "Anonymous"}</h5>
                        </div>
                    </div>
                    <div />
                </div>
                <div className="w-full h-[0.9px] bg-gray-500 mt-5">
                    <div>
                        <h2 className="text-5xl font-bold">{blog.title}</h2>
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