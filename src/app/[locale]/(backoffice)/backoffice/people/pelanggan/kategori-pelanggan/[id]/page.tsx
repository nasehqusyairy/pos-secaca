"use client"

import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { FC } from "react";
import FormCustomerCategoryPage from "../form";
import { useUpdateCustomerCategoriesMutation } from "@/app/api/people/pelanggan/kategori-pelanggan/mutation";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { useRouter } from 'next/navigation'
import { useGetOneCustomerCategoryQuery } from "@/app/api/people/pelanggan/kategori-pelanggan/queries";
import SkeletonDataTable from "@/components/organisms/Skeleton/SkeletonDataTable";

interface CustomerKategoriUpdateProps {
    params: { id: number }
}

const CustomerKategoriUpdate: FC<CustomerKategoriUpdateProps> = ({ params }: CustomerKategoriUpdateProps) => {
    const router = useRouter();
    const mutation = useUpdateCustomerCategoriesMutation();

    const {data, isFetching} = useGetOneCustomerCategoryQuery(params.id);

    const handleCancel = () => {
        // route back
        router.push('/id/backoffice//people/pelanggan/kategori-pelanggan')
    };

    const handleSuccess = () => {
        showToastSuccess("Berhasil merubah Produk").then(() => {});
        handleCancel()
    };

    const handleError = () => {
        showToastError("Gagal merubah Customer category");
        // handleCancel()
    };

    const title = <PageTitleSetting title="Form Customer Category" subtitle="Manage your Customer Category here" />
    if (isFetching) {
        return (
            <>
                <div className="mb-20">
                    { title }
                </div>
                <SkeletonDataTable />
            </>
        )
    }

    const customerCategories = data?.data
    const customerCategoryRules = data?.data.customer_category_rule || {}
    
    return (
        <>
            <div className="mb-20">
                { title }
            </div>
            <FormCustomerCategoryPage 
                customerCategories={ customerCategories } 
                customerCategoryRules={ customerCategoryRules } 
                mutation={ mutation }
                onSuccess={ handleSuccess }
                onCancel={ handleCancel }
                onError={ handleError }
            />
        </>
    )
}

export default CustomerKategoriUpdate;