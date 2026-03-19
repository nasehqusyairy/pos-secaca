import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

interface SkeletonFormPageProps {
    
}
 
const SkeletonFormPage: FC<SkeletonFormPageProps> = () => {
    return ( 
        <div className='mt-10'>
                <div className="grid grid-cols-2 gap-4">
                    {
                        Array(16).fill(0).map((_, i) => (
                            <div key={i} className='mb-6 flex flex-col gap-4'>
                                <Skeleton className='w-[150px] h-6 rounded-md'/>
                                <Skeleton className='w-full h-12 rounded-md'/>
                            </div>
                        ))
                    }
                </div>
                <div className='flex gap-4'>
                    <Skeleton className='w-[150px] h-12 rounded-md'/>
                    <Skeleton className='w-[100px] h-12 rounded-md'/>
                </div>
            </div>
     );
}
 
export default SkeletonFormPage;