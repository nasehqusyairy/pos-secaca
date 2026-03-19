"use client"

import { useGetSalesRefundSummary } from "@/app/api/dashboard/queries";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { FC, useEffect } from "react";

interface SalesRefundSummaryProps {
    start_at?: Date;
    end_at?: Date;
    select_all_location: boolean;
    locs: number[];
    exclude_locs: number[];
}

const SalesRefundSummary: FC<SalesRefundSummaryProps> = (props: SalesRefundSummaryProps) => {
    const { data, isFetching, refetch } = useGetSalesRefundSummary(props);

    useEffect(() => {
        refetch()
    }, [props])

    if (isFetching) {
        return (
            <SkeletonSimple />
        )
    }

    return (
        <div className="w-full">
            <Card>
                <CardHeader>
                    <CardDescription>
                        Total Pengembalian
                    </CardDescription>
                    <CardTitle>
                        { formatRupiah(data?.data.data[0].net_sales_after_tax || 0) }
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}


export default SalesRefundSummary;