"use client"

import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage"
import { FC } from "react"
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { showToastError } from "@/components/templates/SweetAlert";
import { useGetOneLoyaltyQuery } from "@/app/api/people/pelanggan/loyalty/queries";
import EditLoyaltyPageForm from "./form";
import { Loyalties } from "@/app/api/people/pelanggan/loyalty/type";

interface EditLoyaltyPageProps {
    params: {
        id: string
    }
}

const EditLoyaltyPage: FC<EditLoyaltyPageProps> = ({
    params
}) => {
    const t = useTranslations();
    const id = params.id;

    const { data, isFetching } = useGetOneLoyaltyQuery(id);
    if (isFetching) {
        return <SkeletonFormPage />;
    }

    const router = useRouter();
    const onCancel = () => {
        router.push('..')
    };

    const loyalty = data?.data as unknown as Loyalties
    if (!loyalty) {
        showToastError(t('failed_get_name', { name: t('loyalty') }));
        onCancel();
        return;
    }

    return (
        <EditLoyaltyPageForm
            id={id}
            loyalty={loyalty}
            isFetching={isFetching}
            onCancel={onCancel}
        />
    )
}

export default EditLoyaltyPage;