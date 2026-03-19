"use client";

import { FC } from "react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
  } from "@/components/ui/breadcrumb"
import { useRouter } from "next/navigation";
import { FaAngleRight } from "react-icons/fa6";

type BreadCrumbType = {
    title: string;
    link: string;
}

interface BreadCrumSettingProps {
    data: BreadCrumbType[];
}
 
const BreadCrumSetting: FC<BreadCrumSettingProps> = ({data}) => {
    const router = useRouter();

    return ( 
        <div>
            <div className="mb-10">
                <Breadcrumb>
                    <BreadcrumbList>
                        {data?.map((item, index) => (
                            <BreadcrumbItem key={index}>
                                <BreadcrumbLink onClick={() => router.push(item.link)} style={{cursor: 'pointer'}}>{item.title}</BreadcrumbLink>
                                {index !== data.length - 1 && (
                                    <FaAngleRight />
                                )}
                            </BreadcrumbItem>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </div>
     );
}
 
export default BreadCrumSetting;