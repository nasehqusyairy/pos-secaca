"use client"

import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { FC } from "react";

interface FormBrandPageProps {
    
}
 
const FormBrandPage: FC<FormBrandPageProps> = () => {
    return ( 
        <div>
            <PageTitleSetting title="Form Brand" subtitle="Manage your brand here"></PageTitleSetting>
        </div>
     );
}
 
export default FormBrandPage;