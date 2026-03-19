"use client"

import { useGetTop5Products } from "@/app/api/dashboard/queries";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatRupiah } from "@/lib/utils";
import { FC, useEffect } from "react";

interface Top5ProductProps {
    start_at?: Date;
    end_at?: Date;
    select_all_location: boolean;
    locs: number[];
    exclude_locs: number[];
}

const Top5Product: FC<Top5ProductProps> = (props: Top5ProductProps) => {
    const { data, isFetching, refetch } = useGetTop5Products(props);

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
                    <CardTitle>Top 5 Produk</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Nama Produk
                                </TableHead>
                                <TableHead>Kuantitas</TableHead>
                                <TableHead>Total Penjualan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.data.data.map((product: any) => (
                                <TableRow key={product.product_id}>
                                    <TableCell className="font-medium">{product.product_name}</TableCell>
                                    <TableCell className="text-right">{formatRupiah(product.quantity)}</TableCell>
                                    <TableCell className="text-right">{formatRupiah(product.total_line_amount)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default Top5Product;