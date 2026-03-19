import { Employee } from "@/app/api/karyawan/type";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { FaPencilAlt } from "react-icons/fa";

type EmplopyeeProps = {
    onEdit: (location: Employee) => void
    onDelete: (location: Employee, isArchive: boolean) => void
}

export const EmployeeColumnShow = {
    first_name: true,
    role_id: true,
    locations: true
}

export const EmployeeColumns = ({ onEdit, onDelete }: EmplopyeeProps): ColumnDef<Employee>[] => [ 
    // {
    //     accessorKey: "id",
    //     header: "ID",
    //     cell: ({ row }) => (
    //       <div className="w-[100px]">
    //         <span>{row.original.id}</span>
    //       </div>
    //     ),
    //   },
      {
        accessorKey: "first_name",
        header: "Nama",
        cell: ({ row }) => (
          <div className="w-[300px]">
            <span>{row.original.first_name} {row.original.last_name}</span>
          </div>
        ),
      },
      {
        accessorKey: "role_id",
        header: "Role",
        cell: ({ row }) => (
          <div className="w-[150px]">
            <span>{row.original.role.name}</span>
          </div>
        ),
      },
      // {
      //   accessorKey: "locations",
      //   header: "Lokasi",
      //   cell: ({ row }) => {
      //       let name = row.original.locations ? row.original.locations.map((location) => location.name).join(", ") : "";

      //       return (
      //           <div className="w-[150px]">
      //             <span>{name}</span>
      //           </div>
      //       );
      //   },
      // },
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