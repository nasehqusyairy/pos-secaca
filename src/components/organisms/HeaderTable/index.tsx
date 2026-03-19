"use client";

import { useReactTable } from "@tanstack/react-table";

interface HeaderTableProps<TData> {
  table?: ReturnType<typeof useReactTable<TData>>;
  children: React.ReactNode;
  url: string;
}

function HeaderTable<TData>({ table, children, url }: HeaderTableProps<TData>) {
  return (
    <div className="flex gap-1 items-center py-4">
      {children}
      {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Field chooser
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {capitalizeWords(column.id)}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
    </div>
  );
}

export default HeaderTable;
