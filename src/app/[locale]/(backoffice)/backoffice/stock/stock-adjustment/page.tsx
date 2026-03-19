"use client"

import { FC, useEffect, useState } from "react";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { ProductOpnameTable } from "./table";
import { Button } from "@/components/ui/button";
import { addDays, endOfDay } from "date-fns"
import { useGetProductAdjustmentStockQuery } from "@/app/api/product/queries";
import { useDeleteProductAdjustmentStockMutation } from "@/app/api/product/mutation";
import { ProductOpnameColumns, ProductOpnameColumnShow } from "./column";
import FormProductOpnamePage from "./form";
import { DatePickerWithRangeV2 } from "@/components/ui/date-picker-with-range-v2";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { useTranslations } from "next-intl";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import LocationDropdown from "@/components/templates/Dropdowns/location-dropdown";
import { showConfirmationDeletePermanentAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { ProductOpnameResponse as ProductOpnameModel } from "@/app/api/product/product-opname/type";
import { ProductAdjustmentStock } from "@/app/api/product/product-adjustment-stock/type";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import { GetProductAdjustmentStockQueryRequest } from "@/app/api/product/type";
import FooterTableServer from "@/components/organisms/FooterTableServer";

interface ProductOpnameProps {

}

const ProductOpname: FC<ProductOpnameProps> = () => {
    const t = useTranslations()
    const title = t('product_stock_adjustment');
    const router = useRouter();

    const today = new Date()
    const dateFrom = addDays(today, -7)
    dateFrom.setHours(0, 0, 0, 0);

    const dateTo = endOfDay(today)

    const [showForm, setShowForm] = useState(false);
    const [editingData, setEditingData] = useState<ProductOpnameModel | null>(null);
    const [keyword, setKeyword] = useState<string>('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dateFrom,
        to: dateTo,
    })
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [select_all_location, setSelectAllLocation] = useState<boolean>(true);
    const [locs, setLocs] = useState<number[]>([]);
    const [exclude_locs, setExcludeLocs] = useState<number[]>([]);

    const param = {
        startDate: dateRange?.from,
        endDate: dateRange?.to,
        statuses: ["requested", 'approved'],
        select_all_location,
        locs,
        exclude_locs,
        limit,
        page
    } as GetProductAdjustmentStockQueryRequest
    const { data, isFetching, refetch } = useGetProductAdjustmentStockQuery(param)
    const deleteEmployee = useDeleteProductAdjustmentStockMutation();

    function handleEdit(row: ProductAdjustmentStock) {
        router.push(`stock-adjustment/${row.id}`)
    }

    function handleShow(row: ProductAdjustmentStock) {
        router.push(`stock-adjustment/${row.id}?show=true`)
    }

    function handleNewData() {
        router.push(`stock-adjustment/new`)
    }

    function handleDelete(row: ProductAdjustmentStock) {
        showConfirmationDeletePermanentAlert(`produk opname dengan id ${row?.id}`, () => {
            const id = row.id ?? 0;

            deleteEmployee.mutate(id, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Hapus Penyesuaian Stok");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Hapus Penyesuaian Stok");
                }
            });
        })
    }

    function onOpenShowForm() {
        setEditingData(null);
        setShowForm(true);
    }

    function onCloseShowForm() {
        setEditingData(null);
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

    useEffect(() => { handleClick() }, [limit])

    if (showForm) {
        return (
            <>
                <div>
                    <PageTitleSetting title="Form Penyesuaian Stok" subtitle="Atur Penyesuaian Stok"></PageTitleSetting>
                </div>
                <FormProductOpnamePage refetch={refetch} onHiddenForm={onCloseShowForm} disabled={false} />
            </>)
    }

    const dataProductOpname = data?.data.data ?? []
    const columns = ProductOpnameColumns({ onEdit: handleEdit, onShow: handleShow, onDelete: handleDelete });

    return (
        <>
            <div>
                <PageTitleSetting title={title} subtitle="Atur Penyesuaian Stok"></PageTitleSetting>
            </div>

            <div className="w-full flex items-center rounded-md py-1 my-5">
                {/* <div className="flex flex-col gap-2">
                    <Input placeholder={`${t('search')} ${title.toLowerCase()}`} onChange={(event) => setKeyword(event.target.value)} />
                </div> */}
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
                        handleSelectAllChange={setSelectAllLocation}
                        handleIdsChange={setLocs}
                        handleExcludeIdsChange={setExcludeLocs}
                        key="1"
                    />
                </div>
                <div className="flex flex-col gap-2 ml-4">
                    <Button variant="default" size={'sm'} className="w-full" onClick={handleClick}>
                        <IoMdSearch className="mr-2" /> {t('button_search')}
                    </Button>
                </div>
                <div className="flex-end gap-2 ml-4">
                    <Button variant="default" size={'sm'} className="w-full" onClick={handleNewData}>
                        <IoMdAdd className="mr-2" />{t('add')}
                    </Button>
                </div>
            </div>

            <div className="container mx-auto">
                {
                    isFetching ? <SkeletonSimple /> : <ProductOpnameTable columnShow={ProductOpnameColumnShow} columns={columns} data={dataProductOpname} />
                }

                <FooterTableServer
                    rowCount={data?.data.total}
                    currentPage={data?.data.currentPage}
                    lastPage={data?.data.lastPage}
                    hasPrev={data?.data.hasPrev}
                    hasNext={data?.data.hasNext}
                    setPageSize={setLimit}
                    setPage={setPage}
                />
            </div>

        </>
    );
}

export default ProductOpname;