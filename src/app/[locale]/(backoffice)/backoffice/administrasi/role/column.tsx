import { Roles } from "@/app/api/roles/type";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { FaPencilAlt } from "react-icons/fa";

type RolesColumnProps = {
    onEdit: (location: Roles) => void
    onDelete: (location: Roles, isArchive: boolean) => void
}

export const RolesColumnShow = {
    name: true,
    kind: true,
    status: true,
    allow_pos: true,
    allow_backoffice: true,
    entity_permission: false,
    location_permission: false,
    parent_role: true,
    level: false,
    tier: false,
}

export const RolesColumns = ({ onEdit, onDelete }: RolesColumnProps): ColumnDef<Roles>[] => [ 
    // {
    //     accessorKey: "id",
    //     header: "ID",
    //     cell: ({ row }) => (
    //       <div className="w-[100px]">
    //         <span>{row.original.id}</span>
    //       </div>
    //     ),
    //   },
    //   {
    //     accessorKey: "entity_id",
    //     header: "Entity ID",
    //     cell: ({ row }) => (
    //       <div className="w-[200px]">
    //         <span>{row.original.entity_id}</span>
    //       </div>
    //     ),
    //   },
    //   {
    //     accessorKey: "parent_id",
    //     header: "Parent ID",
    //     cell: ({ row }) => (
    //       <div className="w-[200px]">
    //         <span>{row.original.parent_id}</span>
    //       </div>
    //     ),
    //   },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="w-[300px]">
            <span>{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "parent",
        header: 'Parent',
        cell: ({ row }) => (
          <div className="w-[300px]">
            <span>{row.original.parent_role.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "tier",
        header: "Tier",
        cell: ({ row }) => (
          <div className="w-[150px]">
            <span>{row.original.tier}</span>
          </div>
        ),
      },
      {
        accessorKey: "level",
        header: "Level",
        cell: ({ row }) => (
          <div className="w-[150px]">
            <span>{row.original.level}</span>
          </div>
        ),
      },
      {
        accessorKey: "allow_pos",
        header: "Allow POS",
        cell: ({ row }) => (
          <div className="w-[100px]">
            <span>{row.original.allow_pos ? "Yes" : "No"}</span>
          </div>
        ),
      },
      {
        accessorKey: "allow_backoffice",
        header: "Allow Backoffice",
        cell: ({ row }) => (
          <div className="w-[150px]">
            <span>{row.original.allow_backoffice ? "Yes" : "No"}</span>
          </div>
        ),
      },
    //   {
    //     accessorKey: "entity_permission",
    //     header: "Entity Permission",
    //     cell: ({ row }) => (
    //       <div className="w-[300px]">
    //         <span>{JSON.stringify(row.original.entity_permission)}</span>
    //       </div>
    //     ),
    //   },
    //   {
    //     accessorKey: "location_permission",
    //     header: "Location Permissions",
    //     cell: ({ row }) => (
    //       <div className="w-[300px]">
    //         <span>{JSON.stringify(row.original.location_permission)}</span>
    //       </div>
    //     ),
    //   },
    //   {
    //     accessorKey: "parent_role",
    //     header: "Parent Role",
    //     cell: ({ row }) => (
    //       <div className="w-[300px]">
    //         <span>{JSON.stringify(row.original.parent_role)}</span>
    //       </div>
    //     ),
    //   },
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