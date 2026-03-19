"use client"

import { FC, useState } from "react";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import SkeletonDataTable from "@/components/organisms/Skeleton/SkeletonDataTable";
import { ProductOpnameTable } from "./table";
import { Button } from "@/components/ui/button";
import { addDays, endOfDay } from "date-fns"
import { useGetProductOpnameQuery } from "@/app/api/product/queries";
import { useDeleteProductOpnameMutation } from "@/app/api/product/mutation";
import { ProductOpnameColumns, ProductOpnameColumnShow } from "./column";
import FormProductOpnamePage from "./form";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { useTranslations } from "next-intl";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import LocationDropdown from "@/components/templates/Dropdowns/location-dropdown";
import { showConfirmationDeletePermanentAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { GetProductStockOpnameQueryRequest, ProductOpnameResponse as ProductOpnameModel } from "@/app/api/product/product-opname/type";

interface ProductOpnameProps {
    
}
 
const ProductOpname: FC<ProductOpnameProps> = () => {
    const t = useTranslations()
    const title = t('product_opname');
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
    const [page, setPage] = useState<number>(1);
    const [select_all_location, setSelectAllLocation] = useState<boolean>(true);
    const [locs, setLocs] = useState<number[]>([]);
    const [exclude_locs, setExcludeLocs] = useState<number[]>([]);
    
    const param = {
        startDate: new Date(),
        endDate: new Date(),
        exclude_locs,
        select_all_location,
        locs,
    } as GetProductStockOpnameQueryRequest
    const {data, isPending, refetch} = useGetProductOpnameQuery(param)
    const deleteEmployee = useDeleteProductOpnameMutation();

    function handleEdit(row: ProductOpnameModel) {
        router.push("mengelola-stok/produk-opname/"+row.id)
    }

    function handleDelete(row: ProductOpnameModel) {
        showConfirmationDeletePermanentAlert(`produk opname dengan id ${row?.id}`, () => {
            const id = row.id ?? 0;

            deleteEmployee.mutate(id, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Hapus Product Opname");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Hapus Product Opname");
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

    const columns = ProductOpnameColumns({ onEdit: handleEdit, onDelete: handleDelete });

    if (isPending) {
        return  (
        <div>
                <PageTitleSetting title={title} subtitle="Atur Product Opname"></PageTitleSetting>
                <SkeletonDataTable />
            </div>);
    }


    if (showForm) {
        return (
            <>
                <div>
                    <PageTitleSetting title="Form Product Opname" subtitle="Atur Product Opname"></PageTitleSetting>
                </div>
                <FormProductOpnamePage refetch={refetch} onHiddenForm={onCloseShowForm}/>
            </>)
    }

    const dataProductOpname = data?.data ?? []

    return ( 
        <>
            <div>
                <PageTitleSetting title={title} subtitle="Atur Product Opname"></PageTitleSetting>
            </div>

            <div className="w-full flex items-center rounded-md py-1 my-5">
                <div className="flex flex-col gap-2">
                    <Input placeholder={`${t('search')} ${title.toLowerCase()}`} onChange={(event) => setKeyword(event.target.value)} />
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
                <ProductOpnameTable columnShow={ProductOpnameColumnShow} columns={columns} data={dataProductOpname} />
            </div>
            
        </>
     );
}
 
export default ProductOpname;