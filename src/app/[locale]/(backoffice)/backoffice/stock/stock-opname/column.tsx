import { ProductOpnameResponse } from "@/app/api/product/product-opname/type";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, ZoomIn } from "lucide-react";

type ProductOpnameProps = {
  onEdit: (id: number) => void
  onShow: (id: number) => void
  onPreview: (id: number) => void
  onDelete: (location: ProductOpnameResponse, isArchive: boolean) => void
}

export const ProductOpnameColumnShow = {
  form_location: true,
  to_location: true,
  status: true,
  approved_at: true,
}

export const ProductOpnameColumns = ({ onEdit, onShow, onPreview, onDelete }: ProductOpnameProps): ColumnDef<ProductOpnameResponse>[] => [
  {
    accessorKey: "requested_at",
    header: "Tanggal Permintaan",
    cell: ({ row }) => {
      return (
        <div className="w-[150px]">
          <span>{row.original.local_requested_at.toString()}</span>
        </div>
      );
    },
  },
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
    accessorKey: "action",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Button onClick={() => onEdit(row.original.id ?? 0)} size="icon" variant="outline">
            <Pencil className="w-4 h-4" style={{ color: 'green' }} />
          </Button>
          <Button onClick={() => onPreview(row.original.id ?? 0)} size="icon" variant="outline">
            <ZoomIn className="w-4 h-4" style={{ color: 'blue' }} />
          </Button>
          <Button onClick={() => onShow(row.original.id ?? 0)} size="icon" variant="outline">
            <Eye className="w-4 h-4" style={{ color: 'blue' }} />
          </Button>
        </div>
      );
    },
  },
];