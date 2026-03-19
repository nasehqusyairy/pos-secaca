
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
import { Input } from "@/components/ui/input"
import FooterTable from "@/components/organisms/FooterTable"
import HeaderTable from "@/components/organisms/HeaderTable"
import { DataTable } from "@/components/organisms/DataTable"
import { Button } from "@/components/ui/button"
import { IoMdAdd } from "react-icons/io"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  columnShow: any,
  onAdd: () => void
}

export function EmployeeTable<TData, TValue>({
  columns,
  data,
  columnShow,
  onAdd
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
            value={(table.getColumn("first_name")?.getFilterValue() as string)  ?? ""}
            onChange={(event) =>
                table.getColumn("first_name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
      </HeaderTable>

      <div className="my-4">
        <Button variant="default" className="ml-auto" onClick={onAdd}>
            <IoMdAdd  className="mr-2"/> Tambah
        </Button>
      </div>
      <DataTable columns={columns} table={table} />
      <FooterTable table={table} />
    </>
  )
}
