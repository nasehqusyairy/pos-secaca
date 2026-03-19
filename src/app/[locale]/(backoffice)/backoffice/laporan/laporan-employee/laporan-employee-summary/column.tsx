import { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl";
import { formatRupiah } from "@/lib/utils";
import { ReportEmployeeSummary } from "@/app/api/laporan/report-employee-summary/type";

export const ReportEmployeeSummaryColumnShow = {
    employee_sales_name: true,
    sales_amount: true,
    refund_amount: true,
    net_sales_amount: true,
    sales_count: true,
    refund_count: true,
    net_count: true,
    sales_quantity: true,
    refund_quantity: true,
    net_quantity: true,
}

export const ReportEmployeeSummaryColumns = (): ColumnDef<ReportEmployeeSummary>[] => {
    const t = useTranslations();

    return [
        {
            accessorKey: "employee_sales_name",
            header: t('employee_sales_name')
        },
        {
            accessorKey: "sales_amount",
            header: t('sales_amount'),
            cell: ({ row }) => {
              const data = row.original.sales_amount ?? 0

              return (
                <span>{formatRupiah(data)}</span>
              )
            }
        },
        {
            accessorKey: "refund_amount",
            header: t('refund_amount'),
            cell: ({ row }) => {
              const data = row.original.refund_amount ?? 0

              return (
                <span>{formatRupiah(data)}</span>
              )
            }
        },
        {
            accessorKey: "net_sales_amount",
            header: t('net_sales'),
            cell: ({ row }) => {
              const data = row.original.net_sales_amount ?? 0

              return (
                <span>{formatRupiah(data)}</span>
              )
            }
        },
        {
            accessorKey: "sales_count",
            header: t('sales_count'),
            cell: ({ row }) => {
              const data = row.original.sales_count ?? 0

              return (
                <span>{formatRupiah(data)}</span>
              )
            }
        },
        {
            accessorKey: "refund_count",
            header: t('refund_count'),
            cell: ({ row }) => {
              const data = row.original.refund_count ?? 0

              return (
                <span>{formatRupiah(data)}</span>
              )
            }
        },
        {
            accessorKey: "net_count",
            header: t('net_count'),
            cell: ({ row }) => {
              const data = row.original.net_count ?? 0

              return (
                <span>{formatRupiah(data)}</span>
              )
            }
        },
        {
            accessorKey: "sales_quantity",
            header: t('sales_quantity'),
            cell: ({ row }) => {
              const data = row.original.sales_quantity ?? 0

              return (
                <span>{formatRupiah(data)}</span>
              )
            }
        },
        {
            accessorKey: "refund_quantity",
            header: t('refund_quantity'),
            cell: ({ row }) => {
              const data = row.original.refund_quantity ?? 0

              return (
                <span>{formatRupiah(data)}</span>
              )
            }
        },
        {
            accessorKey: "net_quantity",
            header: t('net_quantity'),
            cell: ({ row }) => {
              const data = row.original.net_quantity ?? 0

              return (
                <span>{formatRupiah(data)}</span>
              )
            }
        },
    ]
}