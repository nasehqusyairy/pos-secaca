import { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl";
import { formatRupiah } from "@/lib/utils";
import { ReportSalesByProduct } from "@/app/api/laporan/report-sales-by-product/type";

export const ReportSalesColumnShow = {
    receipt_no: false,
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

export const ReportSalesColumns = (): ColumnDef<ReportSalesByProduct>[] => {
    const t = useTranslations();

    return [
        {
            accessorKey: "code",
            header: t('sales_no')
        },
        {
            accessorKey: "location_name",
            header: t('location_name')
        },
        {
            accessorKey: "local_sales_at",
            header: t('date')
        },
        {
            accessorKey: "cashier_id",
            header: 'Kasir',
            cell: ({ row }) => {
                return (
                    `${row.original.cashier_first_name} ${row.original.cashier_last_name}`
                )
            }
        },
        {
            accessorKey: "employee_sales_id",
            header: 'Sales',
            cell: ({ row }) => {
                return (
                    `${row.original.employee_sales_first_name} ${row.original.employee_sales_last_name}`
                )
            }
        },
        {
            accessorKey: "customer_id",
            header: 'Member',
            cell: ({ row }) => {
                if (!row.original.customer_id) {
                    return ('');
                }

                return (
                    `${row.original.customer_first_name} ${row.original.customer_last_name}`
                )
            }
        },
        {
            accessorKey: "gross_sales",
            header: 'Subtotal',
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.gross_sales ?? 0))
                )
            }
        },
        {
            accessorKey: "discount_amount_before_tax",
            header: t('discount_amount'),
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.discount_amount_before_tax ?? 0))
                )
            }
        },
        {
            accessorKey: "surcharge_amount_before_tax",
            header: t('surcharge_amount'),
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.surcharge_amount_before_tax ?? 0))
                )
            }
        },
        {
            accessorKey: "net_sales_after_tax",
            header: 'Total',
            cell: ({ row }) => {
                return (
                    formatRupiah(Number(row.original.net_sales_after_tax ?? 0))
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