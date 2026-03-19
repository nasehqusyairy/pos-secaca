"use client"

import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import { ReportEmployeeSummaryColumns } from "./column";
import LocationDropdown from "@/components/templates/Dropdowns/location-dropdown";
import { DatePickerWithRangeV2 } from "@/components/ui/date-picker-with-range-v2";
import { Button } from "@/components/ui/button";
import { IoMdSearch } from "react-icons/io";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import FooterTableServer from "@/components/organisms/FooterTableServer";
import { addDays, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { ReportEmployeeSummaryTable } from "./table";
import { useGetReportEmployeeSummaryQuery } from "@/app/api/laporan/report-employee-summary/queries";
import EmployeeDropdown from "@/components/templates/Dropdowns/employee-dropdown";

interface LaporanStockCardPageProps {

}

const LaporanStockCardPage: FC<LaporanStockCardPageProps> = () => {
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

    const [select_all_employee, setSelectAllEmployee] = useState<boolean>(true)
    const [employees, setEmployees] = useState<number[]>([]);
    const [exclude_employees, setExcludeEmployees] = useState<number[]>([]);

    const [keyword, setKeyword] = useState<string>('');

    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const { data, isFetching, refetch } = useGetReportEmployeeSummaryQuery({ 
        select_all_employee, employees, exclude_employees,
        select_all_location, locs, exclude_locs,
        start_at, end_at, limit, page, keyword
    });

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

    const columns = ReportEmployeeSummaryColumns()
    return (
        <>
            <div>
                <PageTitleSetting title={t("laporanEmployeeSummary")} />
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
                        <EmployeeDropdown
                            multiSelect
                            defaultSelectAll
                            handleSelectAllChange={setSelectAllEmployee}
                            handleIdsChange={setEmployees}
                            handleExcludeIdsChange={setExcludeEmployees}
                            key="employee-1"
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
                        <Button variant="default" size={'sm'} className="w-full" onClick={handleClick}>
                            <IoMdSearch className="mr-2" /> {t('button_search')}
                        </Button>
                    </div>
                </div>

                {
                    isFetching ? <SkeletonSimple /> : <ReportEmployeeSummaryTable columns={columns} data={data?.data.data} />
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

export default LaporanStockCardPage;