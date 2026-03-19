import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { FaCross, FaEye, FaPrint, FaTimes } from "react-icons/fa"
import { formatRupiah, formatDate, formatterWithTime } from "@/lib/utils";
import { Order } from "@/types/invoice";
import { useTranslations } from "next-intl";

type SaleTransactionColumnProps = {
    onDetail: (data: Order) => void | null
    onPrint: (data: Order) => void | null
}

export const SaleTransactionColumnShow = {
    local_sales_at: true,
    // code: true,
    // receipt_no: true,
    sales_no: true,
    notes: true,
    net_sales_after_tax: true,
    refunded_amount: true,
}

export const SaleTransactionColumns = ({ onDetail, onPrint }: SaleTransactionColumnProps): ColumnDef<Order>[] => {
    const t = useTranslations();

    return [
        {
            accessorKey: "local_sales_at",
            header: t('sales_date'),
            cell: ({ row }) => {
                return formatDate(new Date(row.original.local_sales_at), formatterWithTime)
            }
        },
        {
            accessorKey: "location_name",
            header: t('location_name'),
        },
        {
            accessorKey: "sales_no",
            header: t('sales_no'),
        },
        // {
        //     accessorKey: "receipt_no",
        //     header: t('receipt_no'),
        // },
        // {
        //     accessorKey: "notes",
        //     header: t('notes'),
        // },
        {
            accessorKey: "net_sales_after_tax",
            header: t('net_sales_after_tax'),
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        {formatRupiah(row.original.net_sales_after_tax, false, false)}
                    </div>
                )
            }
        },
        {
            accessorKey: "refunded_amount",
            header: t('refunded_amount'),
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        {formatRupiah(row.original.refunded_amount, false, false)}
                    </div>
                )
            }
        },
        {
            accessorKey: "action",
            header: "Action",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <Button onClick={() => onDetail(row.original)} size="icon" variant="outline">
                            <FaEye className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => onPrint(row.original)} size="icon" variant="default">
                            <FaPrint className="w-4 h-4" />
                        </Button>
                    </div>
                );
            },
        },
    ]
}