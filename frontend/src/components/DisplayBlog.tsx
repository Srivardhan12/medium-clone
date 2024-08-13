import { Link } from "react-router-dom"

interface blogData {
    id: number,
    title: string,
    content: string,
    date: string,
    authorName: string
}

export const DisplayBlog = ({ id, title, content, date, authorName }: blogData) => {
    return <div className="border-b mb-5">
        <div className="flex">
            <Icon authorName={authorName} />
            <h6 className="text-sm pl-3 font-medium my-auto">{authorName}</h6>
            <div className="h-1 w-1 bg-gray-300 rounded-full my-auto mx-3"></div>
            <span className="flex justify-center flex-col font-light text-gray-600 text-sm">{date}</span>
        </div>
        <Link to={`/blog/${id}`}>
            <div className="pt-2">
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="font-light pt-2">{content}</p>
            </div>
        </Link>
        <div className="py-4">
            <p className="text-sm text-gray-400">{`${Math.ceil(content.length / 280)} minutes read`}</p>
        </div>
    </div>
}

function Icon({ authorName }: Pick<blogData, "authorName">) {
    return <div className="relative inline-flex items-center justify-center w-7 h-7 overflow-hidden bg-gray-300 rounded-full">
        <span className="font-medium text-gray-600">{authorName[0]}</span>
    </div>
}