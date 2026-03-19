import { TransferProduct } from "@/app/api/product/product-transfers/type";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, Check, Trash } from "lucide-react";
import { FaPencilAlt } from "react-icons/fa";

type TransferProductProps = {
    onEdit: (location: TransferProduct) => void
    onDelete: (location: TransferProduct, isArchive: boolean) => void
    onApprove: (location: TransferProduct) => void
    onReject: (location: TransferProduct) => void
}

export const TransferProductColumnShow = {
    form_location: true,
    to_location: true,
    status: true,
    approved_at: true,
}

export const TransferProductColumns = ({ onEdit, onDelete, onApprove, onReject }: TransferProductProps): ColumnDef<TransferProduct>[] => [ 
      {
        accessorKey: "code",
        header: "Kode"
      },
      {
        accessorKey: "from_location",
        header: "Asal Lokasi",
        cell: ({ row }) => {
            const location = row.original?.from_location?.name ?? ''

            return (
                <div className="w-[150px]">
                    <span>{capitalizeWords(location)}</span>
                </div>
            )
        },
      },
      {
        accessorKey: "to_location",
        header: "Tujuan Lokasi",
        cell: ({ row }) => {
            const location = row.original?.to_location?.name ?? ''

            return (
                <div className="w-[150px]">
                    <span>{capitalizeWords(location)}</span>
                </div>
            )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return (
                <div className="w-[150px]">
                  <span>{capitalizeWords(row.original?.status ?? '')}</span>
                </div>
            );
        },
      },
      {
        accessorKey: "approved_at",
        header: "Tanggal Persetujuan",
        cell: ({ row }) => {
            let date = '';
            if (row.original.status === 'approved') date = row.original.local_approved_at
            if (row.original.status === 'rejected') date = row.original.local_rejected_at

            return (
                <div className="w-[150px]">
                  <span>{date}</span>
                </div>
            );
        },
      },
    {
        accessorKey: "action",
        header: "Aksi",
        enableHiding: false,
        cell: ({ row }) => {
            const isApproved = row.original.status === 'approved' || row.original.status === 'rejected';

            return (
                <div className="flex space-x-2">
                    <Button onClick={() => onEdit(row.original)} size="icon" variant="outline">
                        <FaPencilAlt className="w-4 h-4" />
                    </Button>
                    {
                        !isApproved && (
                            <Button onClick={() => onApprove(row.original)} size="icon" variant="outline">
                                <Check className="w-4 h-4" style={{ color: 'green'}}/>
                            </Button> 
                        )
                    }
                    {
                        !isApproved && (
                            <Button onClick={() => onReject(row.original)} size="icon" variant="outline">
                                <Ban className="w-4 h-4" style={{ color: 'red'}}/>
                            </Button> 
                        )
                    }
                    {
                        !isApproved && (
                            <Button onClick={() => onDelete(row.original, false)} size="icon" variant="outline">
                                    <Trash className="w-4 h-4" style={{ color: 'red'}}/>
                            </Button> 
                        )
                    }
                </div>
            );
        },
    },
];