"use client"

import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { FC } from "react";
import FormCustomerCategoryPage from "../form";
import { useCreateCustomerCategoriesMutation } from "@/app/api/people/pelanggan/kategori-pelanggan/mutation";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { useRouter } from 'next/navigation'

interface CustomerKategoriCreateProps {
    
}

const CustomerKategoriCreate: FC<CustomerKategoriCreateProps> = () => {
    const router = useRouter();
    const createMutation = useCreateCustomerCategoriesMutation();

    const handleCancel = () => {
        // route back
        router.push('/id/backoffice//people/pelanggan/kategori-pelanggan')
    };

    const handleSuccess = () => {
        showToastSuccess("Berhasil menyimpan Produk").then(() => {});
        handleCancel()
    };

    const handleError = () => {
        showToastError("Gagal menyimpan Customer category");
        handleCancel()
    };
    
    return (
        <>
            <div className="mb-20">
                <PageTitleSetting title="Form Customer Category" subtitle="Manage your Customer Category here"></PageTitleSetting>
            </div>
            <FormCustomerCategoryPage 
                customerCategories={ null } 
                customerCategoryRules={ null } 
                mutation={ createMutation }
                onSuccess={ handleSuccess }
                onCancel={ handleCancel }
                onError={ handleError }
            />
        </>
    )
}

export default CustomerKategoriCreate;