"use client"

import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage"
import { FC } from "react"
import { useRouter } from "next/navigation";
import { useGetOnePromoQuery } from "@/app/api/revenue-center/promo/queries";
import PromoFormPage from "../../form";
import { showToastError } from "@/components/templates/SweetAlert";
import { Promo } from "@/app/api/revenue-center/promo/type";

interface DetailDailySalePageProps {
    params: {
        id: string
    }
}

const DetailDailySalePage: FC<DetailDailySalePageProps> = ({
    params
}) => {
    const id = params.id;

    const router = useRouter();
    const onCancel = () => {
        router.push('..')
    };

    const onSubmit = () => {}

    const { data, isFetching } = useGetOnePromoQuery(id);
    if (isFetching) {
        return <SkeletonFormPage />;
    }

    const promo = data?.data as unknown as Promo
    if (!promo) {
        showToastError("Gagal mengambil Promo");
        onCancel();
        return;
    }

    return (
        <PromoFormPage 
            data= { promo }
            isFetching={ isFetching }
            viewMode
            handleSubmit={ onSubmit }
            handleCancel={ onCancel }
        />
    )
}

export default DetailDailySalePage;