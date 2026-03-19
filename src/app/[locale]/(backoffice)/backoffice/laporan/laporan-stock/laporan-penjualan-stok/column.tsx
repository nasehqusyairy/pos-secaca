import { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl";
import { formatRupiah } from "@/lib/utils";
import { ReportStockMovement } from "@/app/api/laporan/report-stock-movement/type";

type ReportStockMovementColumnProps = {
}

export const ReportStockMovementColumnShow = {
    product_name: true,
    location_name: true,
    product_unit_name: true,
    created_at: true,
    stock_in: true,
    stock_out: true,
    buying_price: true,
}

export const ReportStockMovementColumns = (_: ReportStockMovementColumnProps): ColumnDef<ReportStockMovement>[] => {
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
            accessorKey: "location_name",
            header: t('location_name')
        },
        {
            accessorKey: "product_unit_name",
            header: t('product_unit_name')
        },
        {
            accessorKey: "created_at",
            header: t('created_at')
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