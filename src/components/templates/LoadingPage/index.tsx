import React, { FC } from "react";

interface LoadingPageProps {
    title: string
}
 
const LoadingPage: FC<LoadingPageProps> = ({
    title
}) => {
    return ( 
        <div>
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-[999]">
            <div className="flex flex-col items-center">
                <div className="loader border-t-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                <p className="mt-4 text-blue-500">{title}</p>
                </div>
            </div>
        </div>
     );
}
 
export default LoadingPage;