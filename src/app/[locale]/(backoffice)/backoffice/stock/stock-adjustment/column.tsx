import { ProductAdjustmentStock } from "@/app/api/product/product-adjustment-stock/type";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Trash } from "lucide-react";
import { FaPencilAlt } from "react-icons/fa";

type ProductOpnameProps = {
  onEdit: (location: ProductAdjustmentStock) => void
  onShow: (location: ProductAdjustmentStock) => void
  onDelete: (location: ProductAdjustmentStock, isArchive: boolean) => void
}

export const ProductOpnameColumnShow = {
  form_location: true,
  to_location: true,
  status: true,
  approved_at: true,
}

export const ProductOpnameColumns = ({ onEdit, onShow, onDelete }: ProductOpnameProps): ColumnDef<ProductAdjustmentStock>[] => [
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
          <Button onClick={() => onShow(row.original)} size="icon" variant="outline">
              <Eye className="w-4 h-4" style={{ color: 'blue' }} />
          </Button>
          {/* <Button onClick={() => onDelete(row.original, false)} size="icon" variant="outline">
            <Trash className="w-4 h-4" style={{ color: 'red' }} />
          </Button> */}
        </div>
      );
    },
  },
];