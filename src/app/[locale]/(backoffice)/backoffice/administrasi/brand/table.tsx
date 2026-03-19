"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import FooterTable from "@/components/organisms/FooterTable"
import HeaderTable from "@/components/organisms/HeaderTable"
import { DataTable } from "@/components/organisms/DataTable"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  columnShow: any
}

export function BrandTable<TData, TValue>({
  columns,
  data,
  columnShow,
}: DataTableProps<TData, TValue>) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(columnShow)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnVisibility,
      columnFilters,
    },
  })

  return (
    <>
      <HeaderTable table={table} url={''}> 
        <Input
            placeholder="Filter name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
      </HeaderTable>
      <DataTable columns={columns} table={table} />
      {/* <EditDataTable columns={columns} table={table}>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
          >
            {row.id !== editingRowId ? (
                row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={`${cell.column.id === 'action' && 'w-12 text-center'}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))
            ) : (
                <TableCell colSpan={row.getVisibleCells().length}>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label htmlFor="email">Your email address</Label>
                        <Input type="text" id="email"/>
                    </div>
                    <div>
                        <Label htmlFor="email">Your email address</Label>
                        <Input type="text" id="email"/>
                    </div>
                    <div>
                        <Label htmlFor="email">Your email address</Label>
                        <Input type="text" id="email"/>
                    </div>
                    <div>
                        <Label htmlFor="email">Your email address</Label>
                        <Input type="text" id="email"/>
                    </div>
                    
                </div>
                <div className="flex space-x-2 mt-4">
                    <Button onClick={() => console.log(row)} variant="default">
                        Save
                    </Button>
                    <Button onClick={() => console.log(row)} variant="outline">
                        Cancel
                    </Button>
                </div>
            </TableCell>
            )}
            
          </TableRow>
        ))}
      </EditDataTable> */}
      <FooterTable table={table} />
    </>
  )
}
