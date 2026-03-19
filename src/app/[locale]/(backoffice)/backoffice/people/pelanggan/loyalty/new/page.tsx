"use client"

import { FC } from "react"
import { useRouter } from "next/navigation";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import LoyaltyFormPage from "../form";
import { useCreateLoyaltyMutation } from "@/app/api/people/pelanggan/loyalty/mutation";
import { useTranslations } from "next-intl";
import { Loyalties } from "@/app/api/people/pelanggan/loyalty/type";

interface LoyaltyNewPageProps {}

const LoyaltyNewPage: FC<LoyaltyNewPageProps> = () => {
    const t = useTranslations();

    const router = useRouter();
    const createLoyalty = useCreateLoyaltyMutation();

    const onSubmit = (formattedData: Loyalties) => {
        if (createLoyalty.isPending) return;

        formattedData = {
            ...formattedData,
            reward_products: formattedData.reward_products.filter((product: any) => !product._destroy)
        }

        createLoyalty.mutate(formattedData, {
            onSuccess: () => {
                showToastSuccess(t('success_create_name', {name: t('loyalty')}));
                onCancel();
            },
            onError: () => {
                showToastError(t('failed_create_name', {name: t('loyalty')}));
                onCancel();
            }
        });
    }

    const onCancel = () => {
        router.push('.')
    };

    return (
        <LoyaltyFormPage 
            handleSubmit={ onSubmit }
            handleCancel={ onCancel }
        />
    )
}

export default LoyaltyNewPage;