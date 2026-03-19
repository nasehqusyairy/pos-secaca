"use client"

import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { FC } from "react";
import FormProductStockOpnamePage from "../form";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface NewStockProductOpnameProps {}
 
const NewStockProductOpname: FC<NewStockProductOpnameProps> = () => {
    const router = useRouter()
    const locale = useLocale();
    
    return ( 
        <>
            <div>
                <PageTitleSetting title='Product Opname' subtitle="Atur Product Opname" />
            </div>
            <FormProductStockOpnamePage
                refetch={() => {}}
                onHiddenForm={() => { router.push(`/${locale}/backoffice/stock/stock-opname`) }}
                disabled={false}
            />
        </>
     );
}
 
export default NewStockProductOpname;