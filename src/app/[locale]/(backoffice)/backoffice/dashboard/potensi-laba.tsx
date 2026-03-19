"use client"

import { useGetPotensiLabas } from "@/app/api/dashboard/queries";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { FC, useEffect } from "react";

interface PotensiLabaProps {
    // start_at?: Date;
    // end_at?: Date;
    select_all_location: boolean;
    locs: number[];
    exclude_locs: number[];
}

const PotensiLaba: FC<PotensiLabaProps> = (props: PotensiLabaProps) => {
    const { data, isFetching, refetch } = useGetPotensiLabas(props);

    useEffect(() => {
        refetch()
    }, [props])

    if (isFetching) {
        return (
            <SkeletonSimple />
        )
    }

    const potensiLabaInPtg = (sell_price: number, cogs: number) => {
        if (cogs == 0) {
            return 0
        }

        return (((sell_price - cogs) / cogs)).toFixed(2)
    }

    return (
        <>
            <div className="w-full">
                <Card>
                    <CardHeader>
                        <CardDescription>
                            Total Stok
                        </CardDescription>
                        <CardTitle>
                            { formatRupiah(data?.data.data[0].stock || 0) }
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div className="w-full">
                <Card>
                    <CardHeader>
                        <CardDescription>
                            Nominal HPP (Stok)
                        </CardDescription>
                        <CardTitle>
                            { formatRupiah(data?.data.data[0].cogs || 0) }
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div className="w-full">
                <Card>
                    <CardHeader>
                        <CardDescription>
                            Nominal Harga (stok)
                        </CardDescription>
                        <CardTitle>
                            { formatRupiah(data?.data.data[0].sell_price || 0) }
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div className="w-full">
                <Card>
                    <CardHeader>
                        <CardDescription>
                            Potensi Laba {potensiLabaInPtg(data?.data.data[0].sell_price || 0, data?.data.data[0].cogs || 0)}%
                        </CardDescription>
                        <CardTitle>
                            { formatRupiah((data?.data.data[0].sell_price || 0) - (data?.data.data[0].cogs || 0)) }
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </>
    )
}


export default PotensiLaba;