"use client"

import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import FooterTableServer from "@/components/organisms/FooterTableServer";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { LoyaltyColumns } from "./column";
import { PromoTable } from "./table";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { useGetLoyaltiesQuery } from "@/app/api/people/pelanggan/loyalty/queries";
import { Loyalties } from "@/app/api/people/pelanggan/loyalty/type";

interface LoyaltyPageProps {

}

const LoyaltyPage: FC<LoyaltyPageProps> = () => {
    const router = useRouter()
    const t = useTranslations()

    const [keyword, setKeyword] = useState<string>('');
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const { data, isFetching, refetch } = useGetLoyaltiesQuery({ limit, page, keyword });


    const handleDetail = (data: Loyalties) => {
        router.push(`loyalty/${data.id}/detail`)
    }

    const handleEdit = (data: Loyalties) => {
        router.push(`loyalty/${data.id}/edit`)
    }

    const handleNew = () => {
        router.push(`loyalty/new`)
    }

    const handleClick = () => {
        if (page > 1) {
            setPage(1)
        } else {
            refetch()
        }
    }

    const columns = LoyaltyColumns({ onDetail: handleDetail, onEdit: handleEdit })

    return (
        <>
            <div>
                <PageTitleSetting title={t("loyalty")} subtitle={`Daftar ${t("loyalty")}`} />
            </div>

            <div className="container mx-auto">
                <div className="w-full flex items-center rounded-md py-1 my-5">
                    <div className="flex flex-col gap-2 mr-4">
                        <Input placeholder={t('search_name', {name: t('loyalty')})} onChange={(event) => setKeyword(event.target.value)} />
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

export default LoyaltyPage;