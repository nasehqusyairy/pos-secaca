import { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl";
import { formatRupiah } from "@/lib/utils";
import { ReportSalesByProduct } from "@/app/api/laporan/report-sales-by-product/type";

export const ReportSalesByProductColumnShow = {
    product_name: true,
    product_sku: true,
    product_category_name: true,
    quantity: true,
    cancelled_quantity: true,
    gross_sales: true,
    cancelled_gross_sales: true,
    discount_amount: true,
    total_amount: true,
    gross_profit: true,
    net_profit: true,
}

export const ReportSalesByProductColumns = (): ColumnDef<ReportSalesByProduct>[] => {
    const t = useTranslations();

    return [
        {
            accessorKey: "product_name",
            header: t('product_name')
        },
        {
            accessorKey: "product_sku",
            header: t('product_sku')
        },
        {
            accessorKey: "product_category_name",
            header: t('product_category_name')
        },
        {
            accessorKey: "description",
            header: 'Deskripsi'
        },
        {
            accessorKey: "quantity",
            header: 'Qty'
        },
        {
            accessorKey: "sell_price",
            header: 'Harga Jual',
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.sell_price ?? 0))
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
            accessorKey: "gross_sales",
            header: 'Penjualan Kotor',
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.gross_sales ?? 0))
                )
            }
        },
        {
            accessorKey: "gross_sales",
            header: 'Total Diskon',
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.discount_amount ?? 0))
                )
            }
        },
        {
            accessorKey: "total_amount",
            header: 'Penjualan Bersih',
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