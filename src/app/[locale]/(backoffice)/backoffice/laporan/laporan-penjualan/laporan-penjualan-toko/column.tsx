import { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl";
import { formatRupiah } from "@/lib/utils";
import { ReportSalesByLocation } from "@/app/api/laporan/report-sales-by-location/type";

export const ReportSalesByLocationColumnShow = {
    location_name: true,
    quantity: true,
    cancelled_quantity: true,
    gross_sales: true,
    cancelled_gross_sales: true,
    discount_amount: true,
    total_amount: true,
    gross_profit: true,
    net_profit: true,
    cost_of_goods_sold: true,
}

export const ReportSalesByLocationColumns = (): ColumnDef<ReportSalesByLocation>[] => {
    const t = useTranslations();

    return [
        {
            accessorKey: "location_name",
            header: t('location_name')
        },
        {
            accessorKey: "quantity",
            header: t('quantity')
        },
        {
            accessorKey: "cancelled_quantity",
            header: t('cancelled_quantity')
        },
        {
            accessorKey: "gross_sales",
            header: t('gross_sales'),
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.gross_sales ?? 0))
                )
            }
        },
        {
            accessorKey: "cost_of_goods_sold",
            header: 'Harga Beli',
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.cost_of_goods_sold ?? 0))
                )
            }
        },
        {
            accessorKey: "gross_profit",
            header: t('gross_profit'),
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.gross_profit ?? 0))
                )
            }
        },
        {
            accessorKey: "gross_refund",
            header: t('cancelled_gross_sales'),
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.gross_refund ?? 0))
                )
            }
        },
        {
            accessorKey: "discount_amount",
            header: t('discount_amount'),
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.discount_amount ?? 0))
                )
            }
        },
        {
            accessorKey: "total_amount",
            header: t('total_amount'),
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.total_amount ?? 0))
                )
            }
        },
        {
            accessorKey: "net_profit",
            header: t('net_profit'),
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.net_profit ?? 0))
                )
            }
        },
    ]
}