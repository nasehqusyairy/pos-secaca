"use client"

import { useGetProductAdjustmentStockDetailQuery } from "@/app/api/product/queries";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { FC } from "react";
import FormProductOpnamePage from "../form";
import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage";
import { useRouter, useSearchParams } from "next/navigation";
import { capitalizeWords } from "@/lib/helpers";
import { useLocale } from "next-intl";

interface EditFormStockAdjustmentProps {}
 
const EditFormStockAdjustment: FC<EditFormStockAdjustmentProps> = () => {
    const router = useRouter()
    const disabled = false
    const id = '0'
    const data = null
    const locale = useLocale();
    
    const buildTitle = () => {
        let title = 'Penyesuaian Stok'

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
            />
        </>
     );
}
 
export default EditFormStockAdjustment;