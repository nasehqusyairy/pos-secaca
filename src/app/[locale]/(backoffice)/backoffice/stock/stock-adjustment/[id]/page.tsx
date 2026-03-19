"use client"

import { useGetProductAdjustmentStockDetailQuery } from "@/app/api/product/queries";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { FC } from "react";
import FormProductOpnamePage from "../form";
import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage";
import { useRouter, useSearchParams } from "next/navigation";
import { capitalizeWords } from "@/lib/helpers";
import { useLocale } from "next-intl";

interface EditFormStockAdjustmentProps {
    params: {
        id: string
    }
}
 
const EditFormStockAdjustment: FC<EditFormStockAdjustmentProps> = ({
    params
}) => {
    const id = params.id;
    const router = useRouter()
    const searchParams = useSearchParams()
    const disabled = searchParams.get('show') == 'true'
    const locale = useLocale();

    const {data, isPending} = useGetProductAdjustmentStockDetailQuery(id)

    if (isPending) {
        return <SkeletonFormPage />;
    }
    
    const buildTitle = () => {
        let title = 'Penyesuaian Stok'
        if (disabled) {
            title += ' - ' + capitalizeWords(data?.data.status ?? '')
        }

        return title
    }

    return ( 
        <>
            <div>
                <PageTitleSetting title={buildTitle()} subtitle="Atur Penyesuaian Stok" />
            </div>
            <FormProductOpnamePage
                refetch={() => {}}
                selectedId={id}
                onHiddenForm={() => {  router.push(`/${locale}/backoffice/stock/stock-adjustment`) }}
                disabled={disabled}
                data={data?.data}
            />
        </>
     );
}
 
export default EditFormStockAdjustment;