"use client"

import { FC, useEffect, useState } from "react";
import { addDays, endOfDay } from "date-fns"
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { Button } from "@/components/ui/button";
import LocationDropdown from "@/components/templates/Dropdowns/location-dropdown";
import { useGetSaleTransactionQuery } from "@/app/api/revenue-center/sale-transaction/queries";
import { SaleTransactionColumns } from "./column";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import { SaleTransactionTable } from "./table";
import FooterTableServer from "@/components/organisms/FooterTableServer";
import { Order } from "@/types/invoice";
import { useRouter } from "next/navigation";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";

interface DaftarPenjualanPageProps {

}

const DaftarPenjualanPage: FC<DaftarPenjualanPageProps> = () => {
    const router = useRouter()

    const today = new Date()
    const dateFrom = addDays(today, -7)
    dateFrom.setHours(0,0,0,0);

    const dateTo = endOfDay(today)

    const [start_at, setStartAt] = useState<Date>(dateFrom)
    const [end_at, setEndAt] = useState<Date>(dateTo)
    const [selectAllLocation, setSelectAllLocation] = useState<boolean>(true)
    const [locs, setLocs] = useState<number[]>([]);
    const [excludeLocs, setExcludeLocs] = useState<number[]>([]);

    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dateFrom,
        to: dateTo,
    })

    useEffect(() => {
        if (!dateRange) return;

        if (dateRange.from) {
            dateRange.from.setHours(0,0,0,0);
            setStartAt(dateRange.from)
        }
        
        if (dateRange.to) {
            setEndAt(endOfDay(dateRange.to))
        }
    }, [dateRange]);

    const { data, isFetching, refetch } = useGetSaleTransactionQuery({ start_at, end_at, select_all_location: selectAllLocation, exclude_locs: excludeLocs, locs, limit, page });

    const handleDetail = (data: Order) => {
        router.push(`daftar-penjualan/${data.id}/detail`)
    }

    const handlePrint = (data: Order) => {
        // router.push(`daftar-penjualan/${data.id}/pdf`)
        const pdfUrl = process.env.NEXT_PUBLIC_API_URL + `/api/sale_transactions/${data.id}/pdf`
        window.open(pdfUrl, "PRINT", "height=400,width=600");
    }

    const handleClick = () => {
        if (page > 1) {
            setPage(1)
        } else {
            refetch()
        }
    }

    const columns = SaleTransactionColumns({ onDetail: handleDetail, onPrint: handlePrint })

    return (
        <>
            <div>
                <PageTitleSetting title="Riwayat Penjualan" subtitle="Daftar riwayat penjualan"></PageTitleSetting>
            </div>

            <div className="container mx-auto">
                <div className="w-[60%] flex items-center rounded-md py-1 my-5">
                    <div className="flex flex-col gap-2">
                        <LocationDropdown
                            multiSelect
                            defaultSelectAll
                            handleSelectAllChange={setSelectAllLocation}
                            handleIdsChange={setLocs}
                            handleExcludeIdsChange={setExcludeLocs}
                            key={'1'}
                        />
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                        <DatePickerWithRange
                            // today={today}
                            date={dateRange}
                            numberOfMonth={2}
                            setDate={setDateRange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                        <Button variant="default" size={'sm'} className="w-full" onClick={handleClick}>
                            Cari
                        </Button>
                    </div>
                </div>

                {
                    isFetching ? <SkeletonSimple /> : <SaleTransactionTable columns={columns} data={data?.data.data} />
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

export default DaftarPenjualanPage;