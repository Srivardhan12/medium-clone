import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";


export interface Blog {
    "title": string;
    "content": string;
    "id": number;
    "author": {
        "name"?: string;
    }
}

export const GetBlog = ({ id }: { id: string }) => {
    const [loding, setLoding] = useState(true);
    const [blog, setBlog] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`)
            .then(response => {
                setBlog(response.data.blog);
                setLoding(false)
            })
    }, [])

    return {
        loding,
        blog
    }
}

export const useBlogs = () => {
    const [loding, setLoding] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`)
            .then(response => {
                setBlogs(response.data.blogs);
                setLoding(false)
            })
    }, [])

    return {
        loding,
        blogs
    }
}