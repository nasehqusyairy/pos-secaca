"use client"

import { useApproveProductTransferMutation, useRejectProductTransferMutation, useUpdateProductTransferMutation } from "@/app/api/product/mutation";
import { useGetProductTransfersQuery } from "@/app/api/product/queries";
import React, { FC, useState } from "react";
import { TransferProductColumns, TransferProductColumnShow } from "./column";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import SkeletonDataTable from "@/components/organisms/Skeleton/SkeletonDataTable";
import { ProductTransferTable } from "./table";
import FormTransferProductPage from "./form";
import { Button } from "@/components/ui/button";
import { addDays, endOfDay } from "date-fns"
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { useTranslations } from "next-intl";
import { DateRange } from "react-day-picker";
import { showConfirmationApprovalAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { GetTransferProductRequest, TransferProduct } from "@/app/api/product/product-transfers/type";

interface ProductTransferProps {

}

const ProductTransfer: FC<ProductTransferProps> = () => {
    const t = useTranslations()
    const title = t('transfer_product');

    const approveTransferProduct = useApproveProductTransferMutation();
    const rejectTransferProduct = useRejectProductTransferMutation();
    
    const today = new Date()
    const dateFrom = addDays(today, -7)
    dateFrom.setHours(0, 0, 0, 0);

    const dateTo = endOfDay(today)

    const [showForm, setShowForm] = useState(false);
    const [keyword, setKeyword] = useState<string>('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dateFrom,
        to: dateTo,
    })
    const [page, setPage] = useState<number>(1);

    const param = {} as GetTransferProductRequest
    const { data, isPending, refetch } = useGetProductTransfersQuery(param)
    const deleteEmployee = useUpdateProductTransferMutation();

    const router = useRouter()

    function handleEdit(row: TransferProduct) {
        // id to route
        router.push(`mengelola-stok/produk-transfer/${row.id}`)
    }

    function handleDelete() {

    }

    function handleApprove(row: TransferProduct) {
        showConfirmationApprovalAlert(row.code, 'approve', () => {
            const values = {
                id: row.id,
                notes: 'Approved',
            } ;

            approveTransferProduct.mutate(values, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Pindah Produk");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Update Pindah Produk");
                }
            });
        })
    }

    function handleReject(row: TransferProduct) {
        showConfirmationApprovalAlert(row.code, 'reject', () => {
            const values = {
                id: row.id,
                notes: 'Reject',
            } ;

            rejectTransferProduct.mutate(values, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Pindah Produk");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Update Pindah Produk");
                }
            });
        })
    }

    function onOpenShowForm() {
        setShowForm(true);
    }

    function onCloseShowForm() {
        setShowForm(false);
    }

    function onClickSearch() {
        refetch()
    }

    const handleClick = () => {
        if (page > 1) {
            setPage(1)
        } else {
            refetch()
        }
    }

    const columns = TransferProductColumns({ onEdit: handleEdit, onDelete: handleDelete, onApprove: handleApprove, onReject: handleReject });

    if (isPending) {
        return (
            <div>
                    <PageTitleSetting title={title}  subtitle="Atur Pindah Produk"></PageTitleSetting>
                    <SkeletonDataTable />
                </div>);
    }

    if (showForm) {
        return (
            <>
                <div>
                    <PageTitleSetting title={`${t('form')} ${title}`} subtitle="Atur Pindah Produk"></PageTitleSetting>
                </div>
                <FormTransferProductPage refetch={refetch} onHiddenForm={onCloseShowForm} />
            </>)
    }

    const dataTransferProduct = data?.data ?? []

    return (
        <>
            <div>
                <PageTitleSetting title={title} subtitle="Atur Pindah Produk"></PageTitleSetting>
            </div>

            <div className="w-full flex items-center rounded-md py-1 my-5">
                <div className="flex flex-col gap-2">
                    <Input placeholder={`${t('search')} ${title.toLowerCase()}`} onChange={(event) => setKeyword(event.target.value)} />
                </div>
                <div className="flex flex-col gap-2 ml-4">
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>
                <div className="flex flex-col gap-2 ml-4">
                    <Button variant="default" size={'sm'} className="w-full" onClick={handleClick}>
                        <IoMdSearch className="mr-2" /> {t('button_search')}
                    </Button>
                </div>
                <div className="flex-end gap-2 ml-4">
                    <Button variant="default" size={'sm'} className="w-full" onClick={onOpenShowForm}>
                        <IoMdAdd className="mr-2" />{t('add')}
                    </Button>
                </div>
            </div>

            <div className="container mx-auto">
                <ProductTransferTable columnShow={TransferProductColumnShow} columns={columns} data={dataTransferProduct}/>
            </div>

        </>
    );
}

export default ProductTransfer;