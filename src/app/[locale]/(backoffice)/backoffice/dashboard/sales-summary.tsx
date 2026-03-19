"use client"

import { useGetSalesSummary } from "@/app/api/dashboard/queries";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { FC, useEffect } from "react";

interface SalesSummaryProps {
    start_at?: Date;
    end_at?: Date;
    select_all_location: boolean;
    locs: number[];
    exclude_locs: number[];
}

const SalesSummary: FC<SalesSummaryProps> = (props: SalesSummaryProps) => {
    const { data, isFetching, refetch } = useGetSalesSummary(props);

    useEffect(() => {
        refetch()
    }, [props])

    if (isFetching) {
        return (
            <SkeletonSimple />
        )
    }

    return (
        <>
            <div className="w-full">
                <Card>
                    <CardHeader>
                        <CardDescription>
                            Total Penjualan
                        </CardDescription>
                        <CardTitle>
                            { formatRupiah(data?.data.data[0].net_sales_after_tax || 0) }
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div className="w-full">
                <Card>
                    <CardHeader>
                        <CardDescription>
                            Total Laba Bersih
                        </CardDescription>
                        <CardTitle>
                            { formatRupiah(data?.data.data[0].net_profit || 0) }
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </>
    )
}


export default SalesSummary;