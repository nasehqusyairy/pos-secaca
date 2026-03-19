import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { FaEye, FaPrint } from "react-icons/fa"
import { formatRupiah, formatDate, formatterWithTime } from "@/lib/utils";
import { DailySale } from "@/app/api/revenue-center/taking/type";

type DailySaleColumnProps = {
    onDetail: (data: DailySale) => void | null;
    onPrint: (data: any) => void | null;
}

export const DailySaleColumnShow = {
    local_sales_at: true,
    taking_id: true,
    sales_amount: true,
    refund_amount: true,
    employee_id: true,
}

export const DailySaleColumns = ({ onDetail, onPrint }: DailySaleColumnProps): ColumnDef<DailySale>[] => [
    {
        accessorKey: "local_sales_at",
        header: "Tanggal Rekapan",
        cell: ({ row }) => {
            return formatDate(new Date(row.original.local_sales_at), formatterWithTime)
        }
    },
    // {
    //     accessorKey: "taking_id",
    //     header: "Jeni",
    //     cell: ({ row }) => {
    //         return (
    //             <Badge className="rounded-sm px-1 font-normal">
    //                 { row.original.taking_id != null ? 'Akhir hari' : 'Shift' }
    //             </Badge>
    //         )
    //     }
    // },
    {
        accessorKey: "employee_id",
        header: "Nama Kasir",
        cell: ({ row }) => {
            return `${row.original.employee_first_name} ${row.original.employee_last_name}`
        }
    },
    {
        accessorKey: "sales_amount",
        header: "Total Penjualan",
        cell: ({ row }) => {
            return formatRupiah(row.original.sales_amount)
        }
    },
    {
        accessorKey: "refund_amount",
        header: "Total Pengembalian",
        cell: ({ row }) => {
            return formatRupiah(row.original.refund_amount)
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