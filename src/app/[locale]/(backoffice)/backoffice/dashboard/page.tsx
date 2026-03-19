"use client"

import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import { addDays, endOfDay } from "date-fns";
import LocationDropdown from "@/components/templates/Dropdowns/location-dropdown";
import { DatePickerWithRangeV2 } from "@/components/ui/date-picker-with-range-v2";
import { Button } from "@/components/ui/button";
import { IoMdSearch } from "react-icons/io";
import { DateRange } from "react-day-picker";
import SalesByDate from "./sales-by-date";
import SalesSummary from "./sales-summary";
import SalesRefundSummary from "./sales-refund-summary";
import Top5Product from "./top-5-product";
import Top5ProductCategory from "./top-5-product-category";
import PotensiLaba from "./potensi-laba";
import AnnualSales from "./annual-sales";

interface DashboardPageProps {
    
}
 
const DashboardPage: FC<DashboardPageProps> = () => {
    const t = useTranslations()
    const title = t('dashboard');
    
    const today = new Date()
    const dateFrom = addDays(today, -0)
    dateFrom.setHours(0, 0, 0, 0);

    const dateTo = endOfDay(today)

    const [select_all_location, setSelectAllLocation] = useState<boolean>(true)
    const [locs, setLocs] = useState<number[]>([]);
    const [exclude_locs, setExcludeLocs] = useState<number[]>([]);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dateFrom,
        to: dateTo,
    })

    return ( 
        <>
            <div>
                <PageTitleSetting title={title}></PageTitleSetting>
            </div>
            <div className="container mx-auto">
                <div className="w-full flex items-center rounded-md py-1 my-5">
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
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 py-2">
                    <SalesSummary 
                        start_at={dateRange?.from}
                        end_at={dateRange?.to}
                        exclude_locs={exclude_locs}
                        locs={locs}
                        select_all_location={select_all_location}
                    />
                    <SalesRefundSummary 
                        start_at={dateRange?.from}
                        end_at={dateRange?.to}
                        exclude_locs={exclude_locs}
                        locs={locs}
                        select_all_location={select_all_location}
                    />
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 py-2">
                    <PotensiLaba 
                        exclude_locs={exclude_locs}
                        locs={locs}
                        select_all_location={select_all_location}
                    />
                </div>
                <div className="py-2">
                    <SalesByDate
                        start_at={dateRange?.from}
                        end_at={dateRange?.to}
                        exclude_locs={exclude_locs}
                        locs={locs}
                        select_all_location={select_all_location}
                    />
                </div>
                <div>
                    <AnnualSales
                        start_at={dateRange?.from}
                        end_at={dateRange?.to}
                        exclude_locs={exclude_locs}
                        locs={locs}
                        select_all_location={select_all_location}
                    />
                </div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2 py-2">
                    <Top5Product
                        start_at={dateRange?.from}
                        end_at={dateRange?.to}
                        exclude_locs={exclude_locs}
                        locs={locs}
                        select_all_location={select_all_location}
                    />
                    <Top5ProductCategory
                        start_at={dateRange?.from}
                        end_at={dateRange?.to}
                        exclude_locs={exclude_locs}
                        locs={locs}
                        select_all_location={select_all_location}
                    />
                </div>
            </div>
        </>
     );
}
 
export default DashboardPage;