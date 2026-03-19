"use client"

import {
  ColumnDef,
  flexRender,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface EditDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  table: ReturnType<typeof useReactTable<TData>>,
  children: React.ReactNode
}

export function EditDataTable<TData, TValue>({
  columns,
  table,
  children
}: EditDataTableProps<TData, TValue>) {

  return (
    <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {children}
          </TableBody>
        </Table>
      </div>
  )
}
