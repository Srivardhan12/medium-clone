import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";


interface Blog {
    "title": string;
    "content": string;
    "id": number;
    "author": {
        "name"?: string;
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