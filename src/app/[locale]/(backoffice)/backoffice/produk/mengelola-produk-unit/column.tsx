import { ProductUnits } from "@/app/api/product/product-unit/type";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineArchive, MdOutlineUnarchive } from "react-icons/md";

type ProductUnitColumnProps = {
    onEdit: (location: ProductUnits) => void
    onDelete: (location: ProductUnits, isArchive: boolean) => void
}

export const ProductUnitColumnShow = {
    name: true,
    // search_name: true,
    status: true
}

export const ProductUnitColumns = ({ onEdit, onDelete }: ProductUnitColumnProps): ColumnDef<ProductUnits>[] => [ 
    {
        accessorKey: "name",
        header: "Nama",
    },
    // {
    //     accessorKey: "search_name",
    //     header: "Search Name",
    // },
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
        header: "Action",
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