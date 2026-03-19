import { ProductOpnameResponse } from "@/app/api/product/product-opname/type";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { FaPencilAlt } from "react-icons/fa";

type ProductOpnameProps = {
    onEdit: (location: ProductOpnameResponse) => void
    onDelete: (location: ProductOpnameResponse, isArchive: boolean) => void
}

export const ProductOpnameColumnShow = {
    form_location: true,
    to_location: true,
    status: true,
    approved_at: true,
}

export const ProductOpnameColumns = ({ onEdit, onDelete }: ProductOpnameProps): ColumnDef<ProductOpnameResponse>[] => [ 
      {
        accessorKey: "location.name",
        header: "Lokasi",
        cell: ({ row }) => {
            const location = row.original?.location?.name ?? ''

            return (
                <div className="w-[150px]">
                    <span>{capitalizeWords(location)}</span>
                </div>
            )
        },
      },
      {
        accessorKey: "employee_requested_by.first_name",
        header: "Nama karyawan",
        cell: ({ row }) => {
            const firstName = row.original?.employee_requested_by?.first_name ?? ''
            const lastName = row.original?.employee_requested_by?.last_name ?? ''
            const name = firstName + ' ' + lastName

            return (
                <div className="w-[150px]">
                    <span>{name}</span>
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
                  <span>{capitalizeWords(row.original?.status ?? ''
                  )}</span>
                </div>
            );
        },
      },
      {
        accessorKey: "requested_at",
        header: "Tanggal Permintaan",
        cell: ({ row }) => {
            return (
                <div className="w-[150px]">
                  <span>{row.original.requested_at.toString()}</span>
                </div>
            );
        },
      },
    {
        accessorKey: "action",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <Button onClick={() => onEdit(row.original)} size="icon" variant="outline">
                        <FaPencilAlt className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => onDelete(row.original, false)} size="icon" variant="outline">
                            <Trash className="w-4 h-4" style={{ color: 'red'}}/>
                    </Button> 
                    {/* {
                        row.original.status == 'active' ? 
                        <Button onClick={() => onDelete(row.original, false)} size="icon" variant="outline">
                            <MdOutlineArchive className="w-4 h-4" style={{ color: 'red'}}/>
                        </Button> 
                        : 
                        <Button onClick={() => onDelete(row.original, true)} size="icon" variant="outline">
                            <MdOutlineUnarchive className="w-4 h-4" style={{ color: 'green'}}/>
                        </Button> 
                    } */}
                </div>
            );
        },
    },
];