"use client"

import { useGetProductOpnamePreviewQuery } from "@/app/api/product/queries";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { FC, useEffect, useState } from "react";
import FormProductOpnamePage from "../../form";
import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { GetProductOpnamePreviewRequest } from "@/app/api/product/product-opname/type";
import FooterTableServer from "@/components/organisms/FooterTableServer";
import { Button } from "@/components/ui/button";

interface EditFormStockAdjustmentProps {
    params: {
        id: string
    }
}
 
const EditFormStockAdjustment: FC<EditFormStockAdjustmentProps> = ({
    params
}) => {
    const id = params.id;
    const router = useRouter()
    const locale = useLocale()
    const disabled = true

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    const param = {
        id,
        page,
        limit,
        show_all: true,
        show_difference: true,
    } as unknown as GetProductOpnamePreviewRequest

    const {data, isPending, refetch} = useGetProductOpnamePreviewQuery(param)
    
    const handleClick = () => {
        if (page > 1) {
            setPage(1)
        } else {
            refetch()
        }
    }

    useEffect(() => { 
        handleClick()
    }, [limit])

    if (isPending) {
        return <SkeletonFormPage />;
    }

    return ( 
        <>
            <div>
                <PageTitleSetting title="Stok Opname" subtitle="Atur Stok Opname" />
            </div>
            <FormProductOpnamePage
                refetch={() => {}}
                selectedId={id}
                onHiddenForm={() => { router.push(`/${locale}/backoffice/stock/stock-opname`) }}
                disabled={disabled}
                preview={true}
                preview_page={(page - 1) * limit}
                data={data?.data.data}
            />
            <FooterTableServer
                rowCount={data?.data.total}
                currentPage={data?.data.currentPage}
                lastPage={data?.data.lastPage}
                hasPrev={data?.data.hasPrev}
                hasNext={data?.data.hasNext}
                setPageSize={setLimit}
                setPage={setPage}
            />
            <div className='flex gap-4'>
                <Button 
                    className='w-[150px]'
                    onClick={() => { router.push(`/${locale}/backoffice/stock/stock-opname/${id}`) }}
                    type='button'>
                    Update
                </Button>
                <Button
                    className="w-[100px]"
                    onClick={() => { router.push(`/${locale}/backoffice/stock/stock-opname`) }}
                    variant="outline"
                    type='button'>
                    Batal
                </Button>
            </div>
        </>
     );
}
 
export default EditFormStockAdjustment;