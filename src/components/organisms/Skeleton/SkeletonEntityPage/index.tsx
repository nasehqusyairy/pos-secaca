import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

interface SkeletonEntityPageProps {
    
}
 
const SkeletonEntityPage: FC<SkeletonEntityPageProps> = () => {
    return ( 
        <div className='mt-10'>
                <div className='mb-10 flex flex-col gap-2'>
                    <Skeleton className='w-[100px] h-6 rounded-md'/>
                    <Skeleton className='w-[200px] h-6 rounded-md'/>
                </div>
                <div className="flex flex-row items-start">
                    <div className="w-[30%]">
                        <Skeleton className='w-[100px] h-6 rounded-md mb-2'/>
                        <Skeleton className='w-[200px] h-6 rounded-md'/>
                    </div>
                    <div className="w-[70%]">
                        <div className='mb-6 flex flex-col gap-2'>
                            <Skeleton className='w-[100px] h-6 rounded-md'/>
                            <Skeleton className='w-[450px] h-12 rounded-md'/>
                        </div>
                        <div className='mb-6 flex flex-col gap-2'>
                            <Skeleton className='w-[100px] h-6 rounded-md'/>
                            <Skeleton className='w-[450px] h-[100px] rounded-md'/>
                        </div>
                        <div className='mb-6 flex flex-col gap-2'>
                            <Skeleton className='w-[100px] h-6 rounded-md'/>
                            <Skeleton className='w-[450px] h-[100px] rounded-md'/>
                        </div>
                        <div className='mb-6 flex flex-col gap-2'>
                            <Skeleton className='w-[100px] h-6 rounded-md'/>
                            <Skeleton className='w-[450px] h-12 rounded-md'/>
                        </div>
                        <div className='mb-6 flex flex-col gap-2'>
                            <Skeleton className='w-[100px] h-6 rounded-md'/>
                            <Skeleton className='w-[450px] h-12 rounded-md'/>
                        </div>
                        <div className='mb-6 flex flex-col gap-2'>
                            <Skeleton className='w-[100px] h-6 rounded-md'/>
                            <Skeleton className='w-[450px] h-12 rounded-md'/>
                        </div>
                        <div className='mb-6 flex flex-col gap-2'>
                            <Skeleton className='w-[100px] h-6 rounded-md'/>
                            <Skeleton className='w-[450px] h-12 rounded-md'/>
                        </div>
                        <div className='mb-6 flex flex-col gap-2'>
                            <Skeleton className='w-[100px] h-6 rounded-md'/>
                            <Skeleton className='w-[450px] h-12 rounded-md'/>
                        </div>
                    </div>
                </div>
            </div>
     );
}
 
export default SkeletonEntityPage;