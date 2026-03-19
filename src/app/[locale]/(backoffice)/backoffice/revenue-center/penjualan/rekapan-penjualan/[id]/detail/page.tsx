"use client"

import { useGetOneDailySaleQuery } from "@/app/api/revenue-center/taking/queries"
import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage"
import { FC } from "react"
import { useRouter } from "next/navigation";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import DailySaleDetail from "./detail";
import { capitalizeWords } from "@/lib/helpers";
import { formatDate, formatterWithTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface DetailDailySalePageProps {
    params: {
        id: string
    }
}

const DetailDailySalePage: FC<DetailDailySalePageProps> = ({
    params
}) => {
    const t = useTranslations();
    const id = params.id;

    const { data, isFetching } = useGetOneDailySaleQuery(id);

    if (isFetching) {
        return <SkeletonFormPage />;
    }

    const dailySale = data?.data
    if (!dailySale) {
        return <SkeletonFormPage />;
    }

    const local_sales_at = new Date(dailySale.local_sales_at);
    const pdfUrl = process.env.NEXT_PUBLIC_API_URL + `/api/daily_sales/${id}/pdf`

    const router = useRouter();
    const onCancel = () => {
        router.push('..')
    };

    const onPrint = (event: any) => {
        event.preventDefault();
        window.open(pdfUrl, "PRINT", "height=400,width=600");
    }

    return (
        <div>
            <PageTitleSetting 
                title={`Rekapan Penjualan - ${capitalizeWords(dailySale.location?.name)}`} 
                subtitle={formatDate(local_sales_at, formatterWithTime)}></PageTitleSetting>
            <div className="container mx-auto py-10">
                <DailySaleDetail taking={dailySale.takingAll} />
                {/* <Tabs defaultValue="all">
                    <TabsList className="flex">
                        <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white p-2 w-full">
                            { t('all_taking') }
                        </TabsTrigger>
                        {
                            dailySale.takings.map((taking: Taking, index: number) => (
                                <TabsTrigger key={index} value={ `${taking.shift_number}-${taking.device_id}` } className="data-[state=active]:bg-primary data-[state=active]:text-white p-2 w-full">
                                    { taking.is_shift ? t('shift') : t('end_of_day') } { taking.shift_number } - { taking.device_id }
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    <TabsContent value="all">
                        <DailySaleDetail taking={dailySale.takingAll} />
                    </TabsContent>
                    {
                        dailySale.takings.map((taking: Taking, index: number) => (
                            <TabsContent key={index} value={ `${taking.shift_number}-${taking.device_id}` }>
                                <DailySaleDetail taking={taking}/>
                            </TabsContent>
                        ))
                    }
                </Tabs> */}
            </div>
            <div className='flex gap-4'>
                <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>
                    { t('back') }
                </Button>
                <Button className="w-[100px]" onClick={onPrint} variant="outline" type='button'>
                    Cetak
                </Button>
            </div>
        </div>
    )
}

export default DetailDailySalePage;