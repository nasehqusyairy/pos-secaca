import { PaymentMethods } from "@/app/api/payment-method/type";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineArchive, MdOutlineUnarchive } from "react-icons/md";

type PaymentMethodColumnProps = {
    onEdit: (location: PaymentMethods) => void
    onDelete: (location: PaymentMethods, isArchive: boolean) => void
}

export const paymentMethodColumnShow = {
    name: true,
    kind: true,
    status: true
}

export const PaymentMethodColumns = ({ onEdit, onDelete }: PaymentMethodColumnProps): ColumnDef<PaymentMethods>[] => [ 
    {
        accessorKey: "name",
        header: "Nama",
    },
    {
        accessorKey: "fixed_fee",
        header: "Biaya tetap (Rp)",
    },
    {
        accessorKey: "variable_fee",
        header: "Biaya (%)",
    },
    {
      accessorKey: "kind",
      header: "Jenis",
      cell: ({ row }) => {
        const data = row.original.kind ?? ''
        return (
          <span>{capitalizeWords(data)}</span>
        )
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const data = row.original.status ?? ''
        return (
          <span>{capitalizeWords(data)}</span>
        )
      }
    },
    {
        accessorKey: "action",
        header: "Aksi",
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <Button onClick={() => onEdit(row.original)} size="icon" variant="outline">
                        <FaPencilAlt className="w-4 h-4" />
                    </Button>
                    {
                        row.original.status == 'active' ? 
                        <Button onClick={() => onDelete(row.original, false)} size="icon" variant="outline">
                            <MdOutlineArchive className="w-4 h-4" style={{ color: 'red'}}/>
                        </Button> 
                        : 
                        <Button onClick={() => onDelete(row.original, true)} size="icon" variant="outline">
                            <MdOutlineUnarchive className="w-4 h-4" style={{ color: 'green'}}/>
                        </Button> 
                    }
                </div>
            );
        },
    },
];