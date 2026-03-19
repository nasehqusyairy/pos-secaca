"use client"

import { FC } from "react";
import { useGetProductTransferQuery } from "@/app/api/product/queries";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { TransferProduct } from "@/app/api/product/product-transfers/type";
import FormTransferProductPage from "../form";
import SkeletonDataTable from "@/components/organisms/Skeleton/SkeletonDataTable";
import { capitalizeWords } from "@/lib/helpers";

interface FormTransferProductPageProps {
    params: {
        show: boolean,
        id: string
    }
}

const TransferProductPage: FC<FormTransferProductPageProps> = ({
    params
}) => {
    const id = params.id;
    const { data, isPending } = useGetProductTransferQuery(id);
    const router = useRouter()
    const searchParams = useSearchParams()
    const disabled = searchParams.get('show') == 'true'

    if (isPending) {
        return (
            <div>
                <PageTitleSetting title="Transfer Produk" subtitle="Atur Transfer Produk"></PageTitleSetting>
                <SkeletonDataTable />
            </div>
        );
    }

    const buildTitle = () => {
        let title = 'Transfer Produk'
        if (disabled) {
            title += ' - ' + capitalizeWords(data?.data.status ?? '')
        }

        return title
    }

    return (
        <div >
            <PageTitleSetting 
                title={ buildTitle() }
                subtitle="Atur Transfer Produk"
            />
            <FormTransferProductPage
                refetch={() => {}}
                selectedId={id}
                disabled={disabled}
                onHiddenForm={() => { router.back() }}
                data={data?.data as TransferProduct}
            />
        </div>
    );
}

export default TransferProductPage;