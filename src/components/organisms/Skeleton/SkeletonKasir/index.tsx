import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

interface SkeletonKasirPageProps {}
 
const SkeletonKasirPage: FC<SkeletonKasirPageProps> = () => {
    return ( 
        <main className="w-auto p-4 md:flex md:justify-center md:gap-10 md:pb-20">
            <section className="w-full md:w-1/2 pt-3 relative">
                <div className="flex justify-between gap-4">
                    <Skeleton className='w-full h-12 rounded-md'/>
                    <Skeleton className='w-[80px] h-12 rounded-md'/>
                </div>
                <Skeleton className='w-full h-[600px] rounded-md mt-4'/>
            </section>
            <Skeleton className="hidden md:block rounded-lg md:w-1/2 xl:w-1/3 sticky top-10 min-h-[calc(100vh-120px)] "/>
        </main>
     );
}
 
export default SkeletonKasirPage;