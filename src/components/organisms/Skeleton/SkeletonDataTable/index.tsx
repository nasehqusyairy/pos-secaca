import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

interface SkeletonDataTableProps {
    
}
 
const SkeletonDataTable: FC<SkeletonDataTableProps> = () => {
    return ( 
        <div className="mt-20">
            <div className="flex justify-between mb-4">
                <Skeleton className="w-[500px] h-10 rounded-lg" />
                <div className="flex gap-4">
                    <Skeleton className="w-[100px] h-10 rounded-lg" />
                </div>
            </div>
            <div className="my-4">
                <Skeleton className="w-[200px] h-10 rounded-lg" />
            </div>
            <div className="mt-4">
                <Skeleton className="w-full h-[520px] rounded-lg" />
            </div>
            <div className="flex justify-between mt-4">
                <Skeleton className="w-[50px] h-10 rounded-lg" />
                <Skeleton className="w-[200px] h-6 rounded-lg" />
                <div className="flex gap-4">
                    <Skeleton className="w-[200px] h-10 rounded-lg" />
                    <Skeleton className="w-[200px] h-10 rounded-lg" />
                </div>
            </div>
        </div>
     );
}
 
export default SkeletonDataTable;