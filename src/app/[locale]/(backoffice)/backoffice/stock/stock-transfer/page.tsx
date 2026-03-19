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
import { DatePickerWithRangeV2 } from "@/components/ui/date-picker-with-range-v2";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { useTranslations } from "next-intl";
import { DateRange } from "react-day-picker";
import { showConfirmationApprovalAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { TransferProduct } from "@/app/api/product/product-transfers/type";
import LocationDropdown from "@/components/templates/Dropdowns/location-dropdown";

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
    const [dataForm, setDataForm] = useState<TransferProduct | undefined>(undefined);
    const [keyword, setKeyword] = useState<string>('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dateFrom,
        to: dateTo,
    })
    const [page, setPage] = useState<number>(1);
    const [selectAllLocationFrom, setSelectAllLocationFrom] = useState<boolean>(true);
    const [locsFrom, setLocsFrom] = useState<number[]>([]);
    const [excludeLocsFrom, setExcludeLocsFrom] = useState<number[]>([]);

    const [selectAllLocationTo, setSelectAllLocationTo] = useState<boolean>(true);
    const [locsTo, setLocsTo] = useState<number[]>([]);
    const [excludeLocsTo, setExcludeLocsTo] = useState<number[]>([]);

    const getParams = {
        startDate: dateRange?.from,
        endDate: dateRange?.to,
        fromLocs: locsFrom,
        fromSelectAllLocation: selectAllLocationFrom,
        fromExcludeLocs: excludeLocsFrom,
        toLocs: locsTo,
        toSelectAllLocation: selectAllLocationTo,
        toExcludeLocs: excludeLocsTo,
    }
    const { data, isPending, refetch } = useGetProductTransfersQuery(getParams)
    const deleteEmployee = useUpdateProductTransferMutation();

    const router = useRouter()

    function handleEdit(row: TransferProduct) {
        // id to route
        // setDataForm(row)
        // setShowForm(true);
        router.push(`stock-transfer/${row.id}`)
    }

    function handleShow(row: TransferProduct) {
        // id to route
        router.push(`stock-transfer/${row.id}?show=true`)
    }

    function handleDelete() {

    }

    function handleApprove(row: TransferProduct) {
        showConfirmationApprovalAlert(row.code, 'approve', () => {
            const values = {
                id: row.id,
                notes: 'Approved',
            };

            approveTransferProduct.mutate(values, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Setujui Pindah Produk");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Setujui Pindah Produk");
                }
            });
        })
    }

    function handleReject(row: TransferProduct) {
        showConfirmationApprovalAlert(row.code, 'reject', () => {
            const values = {
                id: row.id,
                notes: 'Reject',
            };

            rejectTransferProduct.mutate(values, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Menolak Pindah Produk");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Menolak Pindah Produk");
                }
            });
        })
    }
    
    function handlePrint(row: TransferProduct) {
        const pdfUrl = process.env.NEXT_PUBLIC_API_URL + `/api/product_transfer_services/${row.id}/pdf`
        window.open(pdfUrl, "PRINT", "height=400,width=600");
    }

    function onOpenShowForm() {
        setDataForm(undefined)
        setShowForm(true);
    }

    function onCloseShowForm() {
        setDataForm(undefined)
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

    const columns = TransferProductColumns({ 
        onEdit: handleEdit,
        onShow: handleShow,
        onPrint: handlePrint,
        onDelete: handleDelete,
        onApprove: handleApprove,
        onReject: handleReject,
    });

    if (isPending) {
        return (
            <div>
                <PageTitleSetting title={title} subtitle="Atur Pindah Produk"></PageTitleSetting>
                <SkeletonDataTable />
            </div>);
    }

    if (showForm) {
        return (
            <>
                <div>
                    <PageTitleSetting title={`${t('form')} ${title}`} subtitle="Atur Pindah Produk"></PageTitleSetting>
                </div>
                <FormTransferProductPage
                    refetch={refetch}
                    disabled={false}
                    onHiddenForm={onCloseShowForm}
                    data={dataForm}
                />
            </>)
    }

    const dataTransferProduct = data?.data ?? []

    return (
        <>
            <div>
                <PageTitleSetting title={title} subtitle="Atur Pindah Produk"></PageTitleSetting>
            </div>

            <div className="w-full flex items-center rounded-md py-1 my-5">
                <div className="flex flex-col gap-2 ml-4">
                    <DatePickerWithRangeV2
                        key="product-filter"
                        startDate={dateRange?.from}
                        endDate={dateRange?.to}
                        setDate={setDateRange} />
                </div>
                <div className="flex flex-col gap-2  ml-4">
                    <LocationDropdown
                        multiSelect
                        defaultSelectAll
                        handleSelectAllChange={setSelectAllLocationFrom}
                        handleIdsChange={setLocsFrom}
                        handleExcludeIdsChange={setExcludeLocsFrom}
                        key="1"
                    />
                </div>
                <div className="flex flex-col gap-2  ml-4">
                    <LocationDropdown
                        multiSelect
                        defaultSelectAll
                        handleSelectAllChange={setSelectAllLocationTo}
                        handleIdsChange={setLocsTo}
                        handleExcludeIdsChange={setExcludeLocsTo}
                        key="1"
                    />
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
                <ProductTransferTable columnShow={TransferProductColumnShow} columns={columns} data={dataTransferProduct} />
            </div>

        </>
    );
}

export default ProductTransfer;