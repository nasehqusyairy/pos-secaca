"use client"

import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, endOfDay } from "date-fns";
import { useGetDailySalesQuery } from "@/app/api/revenue-center/taking/queries";
import FooterTableServer from "@/components/organisms/FooterTableServer";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import { DailySaleTable } from "./table";
import { Button } from "@/components/ui/button";
import LocationDropdown from "@/components/templates/Dropdowns/location-dropdown";
import { DailySaleColumns } from "./column";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";
import { DailySale } from "@/app/api/revenue-center/taking/type";

interface RekapanPenjualanPageProps {

}

const RekapanPenjualanPage: FC<RekapanPenjualanPageProps> = () => {
    const router = useRouter()

    const today = new Date()
    const dateFrom = addDays(today, -7)
    dateFrom.setHours(0,0,0,0);

    const dateTo = endOfDay(today)

    const [startDate, setStartDate] = useState<Date>(dateFrom)
    const [endDate, setEndDate] = useState<Date>(dateTo)
    const [loc, setLoc] = useState<number>(0);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dateFrom,
        to: dateTo,
    })

    useEffect(() => {
        if (!dateRange) return;

        if (dateRange.from) {
            dateRange.from.setHours(0,0,0,0);
            setStartDate(dateRange.from)
        }
        
        if (dateRange.to) {
            setEndDate(endOfDay(dateRange.to))
        }
    }, [dateRange]);

    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const { data, isFetching, refetch } = useGetDailySalesQuery({ start_at: startDate, end_at: endDate, loc, limit, page });

    const handleDetail = (data: DailySale) => {
        router.push(`rekapan-penjualan/${data.id}/detail`)
    }

    const handleClick = () => {
        if (page > 1) {
            setPage(1)
        } else {
            refetch()
        }
    }
    
    const handlePrint = (data: any) => {
        // router.push(`daftar-penjualan/${data.id}/pdf`)
        const pdfUrl = process.env.NEXT_PUBLIC_API_URL + `/api/daily_sales/${data.id}/pdf`
        window.open(pdfUrl, "PRINT", "height=400,width=600");
    }

    const columns = DailySaleColumns({ onDetail: handleDetail, onPrint: handlePrint })

    return (
        <>
            <div>
                <PageTitleSetting title="Rekapan" subtitle="Daftar rekapan harian"></PageTitleSetting>
            </div>

            <div className="container mx-auto">
                <div className="w-[60%] flex items-center rounded-md py-1 my-5">
                    <div className="flex flex-col gap-2">
                        <LocationDropdown
                            multiSelect = { false }
                            handleIdChange={ setLoc }
                            key="1"
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
                    isFetching ? <SkeletonSimple /> : <DailySaleTable columns={columns} data={data?.data.data} />
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

export default RekapanPenjualanPage;