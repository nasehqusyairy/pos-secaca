import { ProductCategories } from "@/app/api/catalogues/type";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineArchive, MdOutlineUnarchive } from "react-icons/md";

type ProductCategoryColumnProps = {
    onEdit: (location: ProductCategories) => void
    onDelete: (location: ProductCategories, isArchive: boolean) => void
}

export const productCategoryColumnShow = {
    name: true,
    status: true,
}

export const ProductCategoryColumns = ({ onEdit, onDelete }: ProductCategoryColumnProps): ColumnDef<ProductCategories>[] => [ 
    {
        accessorKey: "name",
        header: "Nama",
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