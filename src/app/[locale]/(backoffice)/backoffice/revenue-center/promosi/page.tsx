"use client"

import { useGetPromosQuery } from "@/app/api/revenue-center/promo/queries";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import FooterTableServer from "@/components/organisms/FooterTableServer";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import LocationDropdown from "@/components/templates/Dropdowns/location-dropdown";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Input } from "@/components/ui/input";
import { addDays, endOfDay } from "date-fns";
import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { PromoColumns } from "./column";
import { PromoTable } from "./table";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { Promo } from "@/app/api/revenue-center/promo/type";

interface PromosiPageProps {

}

const PromosiPage: FC<PromosiPageProps> = () => {
    const router = useRouter()
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

    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const { data, isFetching, refetch } = useGetPromosQuery({ start_at, end_at, locs, exclude_locs, select_all_location, limit, page, keyword });

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

    const handleDetail = (data: Promo) => {
        router.push(`promosi/${data.id}/detail`)
    }

    const handleEdit = (data: Promo) => {
        router.push(`promosi/${data.id}/edit`)
    }

    const handleNew = () => {
        router.push(`promosi/new`)
    }

    const handleClick = () => {
        if (page > 1) {
            setPage(1)
        } else {
            refetch()
        }
    }

    const columns = PromoColumns({ onDetail: handleDetail, onEdit: handleEdit })

    return (
        <>
            <div>
                <PageTitleSetting title={t("promosi")} subtitle={`Daftar ${t("promosi")}`} />
            </div>

            <div className="container mx-auto">
                <div className="w-full flex items-center rounded-md py-1 my-5">
                    <div className="flex flex-col gap-2 mr-4">
                        <Input placeholder={t('promosi_search')} onChange={(event) => setKeyword(event.target.value)} />
                    </div>
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
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                        <Button variant="default" size={'sm'} className="w-full" onClick={handleClick}>
                            <IoMdSearch className="mr-2" /> {t('button_search')}
                        </Button>
                    </div>
                    <div className="flex-end gap-2 ml-4">
                        <Button variant="default" size={'sm'} className="w-full" onClick={handleNew}>
                            <IoMdAdd className="mr-2" /> {t('add')}
                        </Button>
                    </div>
                </div>

                {
                    isFetching ? <SkeletonSimple /> : <PromoTable columns={columns} data={data?.data.data} />
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

export default PromosiPage;