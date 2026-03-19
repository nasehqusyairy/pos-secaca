import { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl";
import { formatRupiah } from "@/lib/utils";
import { ReportStockCard } from "@/app/api/laporan/report-stock-card/type";

export const ReportStockCardColumnShow = {
    product_name: true,
    location_name: true,
    product_unit_name: true,
    created_at: true,
    stock_in: true,
    stock_out: true,
    buying_price: true,
}

export const ReportStockCardColumns = (): ColumnDef<ReportStockCard>[] => {
    const t = useTranslations();

    return [
        {
            accessorKey: "product_name",
            header: t('product_name')
        },
        {
            accessorKey: "sell_price",
            header: t('sell_price'),
            cell: ({ row }) => {
              const data = row.original.sell_price ?? 0

              return (
                <span>{formatRupiah(data)}</span>
              )
            }
        },
        {
            accessorKey: "product_unit_name",
            header: t('product_unit_name')
        },
        {
            accessorKey: "stock_in",
            header: t('stock_in')
        },
        {
            accessorKey: "stock_out",
            header: t('stock_out')
        },
    ]
}