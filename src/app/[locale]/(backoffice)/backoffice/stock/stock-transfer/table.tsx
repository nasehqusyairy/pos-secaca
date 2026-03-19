
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

import React, { useState } from "react"
import FooterTable from "@/components/organisms/FooterTable"
import { DataTable } from "@/components/organisms/DataTable"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  columnShow: any
}

export function ProductTransferTable<TData, TValue>({
  columns,
  data,
  columnShow
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
        {/* <div className="flex justify-between items-center py-4">
            <Input
                placeholder="Filter location..."
                value={((table.getColumn("to_location")?.getFilterValue() as string) || (table.getColumn("from_location")?.getFilterValue() as string))  ?? ""}
                onChange={(event) =>
                    table.getColumn("to_location")?.setFilterValue(event.target.value) ||
                    table.getColumn("from_location")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
            />
            <div className="flex gap-4">
                <Button variant="default" className="ml-auto" onClick={onAdd}>
                    <IoMdAdd  className="mr-2"/> Tambah Data
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="ml-auto">
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
                </DropdownMenu>
            </div>
        </div> */}
      <DataTable columns={columns} table={table} />
      <FooterTable table={table} />
    </>
  )
}
