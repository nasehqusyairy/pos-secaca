"use client"

import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import { ReportSalesByLocationColumns } from "./column";
import LocationDropdown from "@/components/templates/Dropdowns/location-dropdown";
import { DatePickerWithRangeV2 } from "@/components/ui/date-picker-with-range-v2";
import { Button } from "@/components/ui/button";
import { IoMdSearch } from "react-icons/io";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import FooterTableServer from "@/components/organisms/FooterTableServer";
import { addDays, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { ReportSalesByLocationTable } from "./table";
import { useGetReportSalesByLocationQuery } from "@/app/api/laporan/report-sales-by-location/queries";
import DiskonAllDropdown from "@/components/templates/Dropdowns/diskon-all-dropdown";

interface LaporanPenjualanPageProps {}

const LaporanPenjualanPage: FC<LaporanPenjualanPageProps> = () => {
    const t = useTranslations()

    const today = new Date()
    const dateFrom = addDays(today, -7)
    dateFrom.setHours(0, 0, 0, 0);

    const dateTo = endOfDay(today)

    const [start_at, setStartAt] = useState<Date>(dateFrom)
    const [end_at, setEndAt] = useState<Date>(dateTo)
    const [select_all_location, setSelectAllLocation] = useState<boolean>(true)
    const [locs, setLocs] = useState<number[]>([]);
    const [exclude_locs, setExcludeLocs] = useState<number[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [discounted, setDiscounted] = useState<string>('all');

    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const { data, isFetching, refetch } = useGetReportSalesByLocationQuery({ start_at, end_at, locs, exclude_locs, select_all_location, limit, page, keyword, discounted });

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dateFrom,
        to: dateTo,
    })

    useEffect(() => {
        if (!dateRange) return;

        if (dateRange.from) {
            dateRange.from.setHours(0, 0, 0, 0);
            setStartAt(dateRange.from)
        }

        if (dateRange.to) {
            setEndAt(endOfDay(dateRange.to))
        }
    }, [dateRange]);

    const handleClick = () => {
        if (page > 1) {
            setPage(1)
        } else {
            refetch()
        }
    }

    const columns = ReportSalesByLocationColumns()
    return (
        <>
            <div>
                <PageTitleSetting title={t("laporanPenjualanByToko")} />
            </div>

            <div className="container mx-auto">
                <div className="w-full flex items-center rounded-md py-1 my-5">
                    {/* <div className="flex flex-col gap-2 mr-4">
                        <Input placeholder={t('promosi_search')} onChange={(event) => setKeyword(event.target.value)} />
                    </div> */}
                    <div className="flex flex-col gap-2">
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
                        <DatePickerWithRangeV2 
                            key="product"
                            startDate={dateRange?.from}
                            endDate={dateRange?.to}
                            setDate={setDateRange} />
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                        <DiskonAllDropdown
                            defaultValue={ discounted }
                            handleValueChange={ setDiscounted }
                            key="1"
                        />
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                        <Button variant="default" size={'sm'} className="w-full" onClick={handleClick}>
                            <IoMdSearch className="mr-2" /> {t('button_search')}
                        </Button>
                    </div>
                </div>

                {
                    isFetching ? <SkeletonSimple /> : <ReportSalesByLocationTable columns={columns} data={data?.data.data} />
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

export default LaporanPenjualanPage;