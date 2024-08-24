export default function BlogSkeleton() {
    return (
        <div>
            <div role="status" className="animate-pulse flex flex-col justify-center mb-8">
                <div className="flex items-center">
                    <div className="h-8 bg-gray-200 rounded-full w-8 mb-4"></div>
                    <div className="h-2.5 bg-gray-200 rounded-full w-28 mb-4 ml-3"></div>
                    <div className="h-1 bg-gray-200 rounded-full w-1 mb-4 ml-3"></div>
                    <div className="h-2.5 bg-gray-200 rounded-full w-14 mb-4 ml-3"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded-full w-40 mb-3"></div>
                <div className="h-2.5 bg-gray-200 rounded-full w-full mb-2"></div>
                <div className="h-2.5 bg-gray-200 rounded-full w-full mb-2"></div>
                <div className="h-2.5 bg-gray-200 rounded-full w-20 mb-2"></div>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}
