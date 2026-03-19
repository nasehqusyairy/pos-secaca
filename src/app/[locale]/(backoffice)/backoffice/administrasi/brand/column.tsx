import { Brand } from "@/app/api/brand/brand";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

type BrandsColumnProps = {
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
};

export const brandColumnShow = {
  name: true,
  code: false,
  initial: true,
  status: true,
  action: true,
};

export const brandsColumns = ({
  onEdit,
  onDelete,
}: BrandsColumnProps): ColumnDef<Brand>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "initial",
    header: "Initial",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "action",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Button
            onClick={() => onEdit(row.original)}
            size="icon"
            variant="outline"
          >
            <FaPencilAlt className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(row.original)}
            size="icon"
            variant="outline"
          >
            <MdDelete className="w-4 h-4" style={{ color: "red" }} />
          </Button>
        </div>
      );
    },
  },
];
