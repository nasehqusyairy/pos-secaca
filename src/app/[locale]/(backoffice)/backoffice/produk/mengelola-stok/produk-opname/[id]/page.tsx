"use client"

import { useGetProductOpnameDetailQuery } from "@/app/api/product/queries";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { FC } from "react";
import FormProductOpnamePage from "../form";
import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage";

interface EditFormOpnameProps {
    params: {
        id: string
    }
}
 
const EditFormOpname: FC<EditFormOpnameProps> = ({
    params
}) => {
    const id = params.id;

    const {data, isPending} = useGetProductOpnameDetailQuery(id)

    if (isPending) {
        return <SkeletonFormPage />;
    }

    return ( 
        <>
            <div>
                <PageTitleSetting title="Form Product Opname" subtitle="Manage your Product Opname here"></PageTitleSetting>
            </div>
            <FormProductOpnamePage refetch={() => {}} onHiddenForm={() => {}} data={data?.data}/>
        </>
     );
}
 
export default EditFormOpname;