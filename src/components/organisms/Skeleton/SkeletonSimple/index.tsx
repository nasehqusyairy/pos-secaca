import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

interface SkeletonSimpleProps {
    
}
 
const SkeletonSimple: FC<SkeletonSimpleProps> = () => {
    return ( 
        <div className="mt-4">
            <Skeleton className="w-full h-[520px] rounded-lg" />
        </div>
     );
}
 
export default SkeletonSimple;