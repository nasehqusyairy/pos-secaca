"use client"

import { FC } from "react"
import { useRouter } from "next/navigation";
import { useCreatePromoMutation } from "@/app/api/revenue-center/promo/mutation";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import PromoFormPage from "../form";
import { Promo } from "@/app/api/revenue-center/promo/type";

interface PromoNewPageProps {

}

const PromoNewPage: FC<PromoNewPageProps> = () => {
    const router = useRouter();
    const addPromo = useCreatePromoMutation();

    const onSubmit = (formattedData: Promo) => {
        if (addPromo.isPending) return;

        addPromo.mutate(formattedData, {
            onSuccess: () => {
                showToastSuccess("Berhasil Create Promo");
                onCancel();
            },
            onError: () => {
                showToastError("Gagal Create Promo");
                onCancel();
            }
        });
    }

    const onCancel = () => {
        router.push('.')
    };

    return (
        <PromoFormPage 
            handleSubmit={ onSubmit }
            handleCancel={ onCancel }
        />
    )
}

export default PromoNewPage;