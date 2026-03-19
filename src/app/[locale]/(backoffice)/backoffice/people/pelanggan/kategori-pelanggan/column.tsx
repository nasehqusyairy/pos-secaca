import { capitalizeWords } from "@/lib/helpers"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { FaPencilAlt } from "react-icons/fa"
import { MdOutlineArchive, MdOutlineUnarchive } from "react-icons/md"
import { CustomerCategories } from "@/app/api/people/pelanggan/kategori-pelanggan/type";

type CustomerCategoryColumnProps = {
    onEdit: (data: CustomerCategories) => void | null
    onArchive: (data: CustomerCategories) => void | null
    onActivate: (data: CustomerCategories) => void | null
}

export const CustomerCategoryColumnShow = {
    name: true,
    status: true,
    required: true,
}

export const CustomerCategoryColumns = ({ onEdit, onArchive, onActivate }: CustomerCategoryColumnProps): ColumnDef<CustomerCategories>[] => [
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
        accessorKey: "required",
        header: "Diperlukan",
        cell: ({ row }) => {
            const data = row.original.required ? 'Ya' : 'Tidak';
            return (
                <span>{data}</span>
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
                            <Button onClick={() => onArchive(row.original)} size="icon" variant="outline">
                                <MdOutlineArchive className="w-4 h-4" style={{ color: 'red' }} />
                            </Button>
                            :
                            <Button onClick={() => onActivate(row.original)} size="icon" variant="outline">
                                <MdOutlineUnarchive className="w-4 h-4" style={{ color: 'green' }} />
                            </Button>
                    }
                </div>
            );
        },
    },
]