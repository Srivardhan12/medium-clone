export default function MyBlogsSkeleton() {
    return (
        <div role="status" className="animate-pulse flex flex-col justify-center bg-white p-6 rounded-lg mb-8 border">
            <div className="h-5 bg-gray-200 rounded-full w-40 mb-3"></div>
            <div className="h-2.5 bg-gray-200 rounded-full w-full mb-2"></div>
            <div className="h-2.5 bg-gray-200 rounded-full w-full mb-2"></div>
            <div className="h-2.5 bg-gray-200 rounded-full w-20 mb-2"></div>
            <div className="h-2.5 bg-gray-200 rounded-full w-40 mt-4"></div>
            <span className="sr-only">Loading...</span>
        </div>
    )
}
