import { OrderTypes } from "@/app/api/order-type/type";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineArchive, MdOutlineUnarchive } from "react-icons/md";

type OrderTypeColumnProps = {
    onEdit: (location: OrderTypes) => void
    onDelete: (location: OrderTypes, isArchive: boolean) => void
}

export const OrderTypeColumnShow = {
    name: true,
    fixed_fee: true,
    variable_fee: true,
    status: true
}

export const OrderTypeColumns = ({ onEdit, onDelete }: OrderTypeColumnProps): ColumnDef<OrderTypes>[] => [ 
    {
        accessorKey: "name",
        header: "Nama",
    },
    {
      accessorKey: "fixed_fee",
      header: "Biaya Tetap (Rp)",
    },
    {
      accessorKey: "variable_fee",
      header: "Biaya (%)",
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