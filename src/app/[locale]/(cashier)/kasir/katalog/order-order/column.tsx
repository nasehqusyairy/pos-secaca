import { ColumnDef } from "@tanstack/react-table"
import { CustomerOrder } from "@/app/api/customer_order/type";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type OpenOrderColumnProps = {
    onSelect: (customerOrder: CustomerOrder) => void
}

export const OpenOrderColumnhow = {
    code: true,
    customer: true,
    total_amount: true,
}

export const OpenOrderColumn = ({ onSelect }: OpenOrderColumnProps): ColumnDef<CustomerOrder>[] => {
    return [
        {
            accessorKey: "code",
            header: 'No Pesanan'
        },
        // {
        //     accessorKey: "customer",
        //     header: 'Pelanggan'
        // },
        {
            accessorKey: "total_amount",
            header: 'Total',
            cell: ({ row }) => {
                const data = parseInt(row.original.total_amount ?? '0')

                return (
                    <span>{formatRupiah(data)}</span>
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
                        <Button onClick={() => onSelect(row.original)} variant="outline" type="button">
                            Pilih
                        </Button>
                    </div>
                );
            },
        },
    ]
}