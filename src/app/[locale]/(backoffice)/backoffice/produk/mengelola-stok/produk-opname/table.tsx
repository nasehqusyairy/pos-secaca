
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

export function ProductOpnameTable<TData, TValue>({
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
      <DataTable columns={columns} table={table} />
      <FooterTable table={table} />
    </>
  )
}
