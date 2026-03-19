"use client"

import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage"
import { FC } from "react"
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LoyaltyFormPage from "../../form";
import { showToastError } from "@/components/templates/SweetAlert";
import { useGetOneLoyaltyQuery } from "@/app/api/people/pelanggan/loyalty/queries";
import { Loyalties } from "@/app/api/people/pelanggan/loyalty/type";

interface DetailLoyaltyPageProps {
    params: {
        id: string
    }
}

const DetailLoyaltyPage: FC<DetailLoyaltyPageProps> = ({
    params
}) => {
    const t = useTranslations();
    const id = params.id;

    const router = useRouter();
    const onCancel = () => {
        router.push('..')
    };

    const { data, isFetching } = useGetOneLoyaltyQuery(id);
    if (isFetching) {
        return <SkeletonFormPage />;
    }

    const loyalty = data?.data as unknown as Loyalties
    if (!loyalty) {
        showToastError(t('failed_get_name', { name: t('loyalty') }));
        onCancel();
        return;
    }

    const onSubmit = (formattedData: Loyalties) => { }

    return (
        <LoyaltyFormPage
            data={loyalty}
            isFetching={isFetching}
            viewMode
            handleSubmit={onSubmit}
            handleCancel={onCancel}
        />
    )
}

export default DetailLoyaltyPage;