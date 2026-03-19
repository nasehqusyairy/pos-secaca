"use client"

import { useGetSalesByDate } from "@/app/api/dashboard/queries";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import { FC, useEffect } from "react";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";

interface SalesByDateProps {
    start_at?: Date;
    end_at?: Date;
    select_all_location: boolean;
    locs: number[];
    exclude_locs: number[];
}

const SalesByDate: FC<SalesByDateProps> = (props: SalesByDateProps) => {
    const { data, isFetching, refetch } = useGetSalesByDate(props);

    useEffect(() => {
        refetch()
    }, [props])

    if (isFetching) {
        return (
            <SkeletonSimple />
        )
    }

    const chartConfig = {
        net_sales_after_tax: {
            label: "Total Penjualan",
            color: "hsl(var(--chart-1))",
        },
        net_profit: {
            label: "Total Laba",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig

    const renderCustomizedLabel = (props: any) => {
        const { x, y, width, height, value } = props;

        return (
            <g>
                <text x={x + width / 2} y={y - 15} fill="#000" textAnchor="middle" dominantBaseline="middle">
                    {formatRupiah(value)}
                </text>
            </g>
        );
    }

    const mappedData = (data?.data.data || []).map((a: any) => a?.net_sales_after_tax)
    const highestAmount = Math.round(Math.max(...mappedData) * 1.1 /1000)*1000;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Penjualan Per Hari</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="max-h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={data?.data.data}
                        margin={{
                            top: 20,
                        }}
                        maxBarSize={100}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <ChartLegend content={<ChartLegendContent />} />
                        <YAxis domain={[0, highestAmount]} />
                        <XAxis
                            dataKey="local_sales_date"
                        />
                        <Bar
                            dataKey="net_sales_after_tax"
                            fill="var(--color-net_sales_after_tax)">
                            <LabelList
                                position="top"
                                className="fill-foreground"
                                content={renderCustomizedLabel}
                            />
                        </Bar>
                        <Bar
                            dataKey="net_profit"
                            fill="var(--color-net_profit)">
                            <LabelList
                                position="top"
                                className="fill-foreground"
                                content={renderCustomizedLabel}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default SalesByDate;