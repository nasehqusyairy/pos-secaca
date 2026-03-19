"use client"

import { FC } from "react"
import { useTranslations } from "next-intl";
import LoyaltyFormPage from "../../form";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { useUpdateLoyaltyMutation } from "@/app/api/people/pelanggan/loyalty/mutation";
import { Loyalties } from "@/app/api/people/pelanggan/loyalty/type";

interface EditLoyaltyPageFormProps {
    id: string,
    loyalty: Loyalties,
    isFetching: boolean,
    onCancel: () => void,
}

const EditLoyaltyPageForm: FC<EditLoyaltyPageFormProps> = (props: EditLoyaltyPageFormProps) => {
    const t = useTranslations();

    const updateLoyalty = useUpdateLoyaltyMutation(props.id);
    const onSubmit = (formattedData: Loyalties) => {
        if (updateLoyalty.isPending) return;

        updateLoyalty.mutate(formattedData, {
            onSuccess: () => {
                showToastSuccess(t('success_update_name', {name: t('loyalty')}));
                props.onCancel();
            },
            onError: () => {
                showToastError(t('failed_update_name', {name: t('loyalty')}));
                props.onCancel();
            }
        });
    }

    return (
        <LoyaltyFormPage
            data={props.loyalty}
            isFetching={props.isFetching}
            handleSubmit={onSubmit}
            handleCancel={props.onCancel}
        />
    )
}

export default EditLoyaltyPageForm;