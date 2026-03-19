"use client"

import { useGetAnnualSales } from "@/app/api/dashboard/queries";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import { FC, useEffect } from "react";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";

interface AnnualSalesProps {
    start_at?: Date;
    end_at?: Date;
    select_all_location: boolean;
    locs: number[];
    exclude_locs: number[];
}

const AnnualSales: FC<AnnualSalesProps> = (props: AnnualSalesProps) => {
    const firstToday = new Date()
    const secondToday = new Date()

    const firstYear = firstToday.getFullYear() - 1
    const secondYear = secondToday.getFullYear()

    const queryParams = {
        first_year: firstYear,
        second_year: secondYear,
        select_all_location: props.select_all_location,
        locs: props.locs,
        exclude_locs: props.exclude_locs
    };

    const { data, isFetching, refetch } = useGetAnnualSales(queryParams);

    useEffect(() => {
        refetch()
    }, [props])

    if (isFetching) {
        return (
            <SkeletonSimple />
        )
    }

    const chartConfig = {
        first_year_net_sales_after_tax: {
            label: "" + firstYear,
            color: "hsl(var(--chart-1))",
        },
        second_year_net_sales_after_tax: {
            label: "" + secondYear,
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig

    const chartSummaryConfig = {
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

    const mappedData = (data?.data.data.first_year_net_sales_after_tax || []).concat((data?.data.data.second_year_net_sales_after_tax || []))
    const highestAmount = Math.round(Math.max(...mappedData) * 1.1 / 1000) * 1000;

    const chartData = []

    const months = data?.data.data.months
    const first_year_net_sales_after_tax = data?.data.data.first_year_net_sales_after_tax
    const first_year_net_profit = data?.data.data.first_year_net_profit
    const second_year_net_sales_after_tax = data?.data.data.second_year_net_sales_after_tax
    const second_year_net_profit = data?.data.data.second_year_net_profit

    let sum_first_year_net_sales_after_tax = 0
    let sum_first_year_net_profit = 0
    let sum_second_year_net_sales_after_tax = 0
    let sum_second_year_net_profit = 0
    for (let i = 0; i < 12; i++) {
        let obj =  { month: months[i], first_year_net_sales_after_tax: first_year_net_sales_after_tax[i] }
        if (firstYear != secondYear) {
            Object.assign(obj, { second_year_net_sales_after_tax: second_year_net_sales_after_tax[i] })

            sum_second_year_net_sales_after_tax += parseInt(second_year_net_sales_after_tax[i])
            sum_second_year_net_profit += parseInt(second_year_net_profit[i])
        }

        chartData.push(obj)

        sum_first_year_net_sales_after_tax += parseInt(first_year_net_sales_after_tax[i])
        sum_first_year_net_profit += parseInt(first_year_net_profit[i])
    }

    const summaryChartData = [{ year: firstYear, net_sales_after_tax: sum_first_year_net_sales_after_tax, net_profit: sum_first_year_net_profit }];
    if (firstYear != secondYear) {
        summaryChartData.push({ year: secondYear, net_sales_after_tax: sum_second_year_net_sales_after_tax, net_profit: sum_second_year_net_profit });
    }

    return (
        <>
            <div className="w-full py-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Penjualan Per Bulan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={chartConfig}
                            className="max-h-[250px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    top: 20,
                                }}
                                maxBarSize={100}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <ChartLegend content={<ChartLegendContent />} />
                                <YAxis domain={[0, highestAmount]} />
                                <XAxis
                                    dataKey="month"
                                />
                                <Bar
                                    dataKey="first_year_net_sales_after_tax"
                                    fill="var(--color-first_year_net_sales_after_tax)">
                                    <LabelList
                                        position="top"
                                        className="fill-foreground"
                                        content={renderCustomizedLabel}
                                    />
                                </Bar>
                                {
                                    firstYear != secondYear && 
                                        <Bar
                                            dataKey="second_year_net_sales_after_tax"
                                            fill="var(--color-second_year_net_sales_after_tax)">
                                            <LabelList
                                                position="top"
                                                className="fill-foreground"
                                                content={renderCustomizedLabel}
                                            />
                                        </Bar>
                                }
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            <div className="w-full py-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Penjualan Per Tahun</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={chartSummaryConfig}
                            className="max-h-[250px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                data={summaryChartData}
                                margin={{
                                    top: 20,
                                }}
                                maxBarSize={100}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <ChartLegend content={<ChartLegendContent />} />
                                <YAxis domain={[0, highestAmount]} />
                                <XAxis
                                    dataKey="year"
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
            </div>
        </>
    )
}

export default AnnualSales;