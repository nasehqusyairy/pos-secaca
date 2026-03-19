"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import FooterTable from "@/components/organisms/FooterTable"
import HeaderTable from "@/components/organisms/HeaderTable"
import { TableCell, TableRow } from "@/components/ui/table"
import { EditDataTable } from "@/components/organisms/EditDataTable"
import { IoMdAdd } from "react-icons/io"
import { Separator } from "@/components/ui/separator"
import { ProductCategories } from "@/app/api/catalogues/type"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  columnShow: any,
  editingRowId: number | string | null,
  children: React.ReactNode,
  onAdd: () => void
}

export function ProductCategoryTable<TData, TValue>({
  columns,
  data,
  columnShow,
  editingRowId,
  children,
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

  const tableColumnsCount = useMemo(
    () => table.getAllColumns().filter((column) => column.getCanHide()).length,
    [table]
  )
  
  const rowData = table.getRowModel().rows.map(data => {
    const dataProduct = data.original as ProductCategories; 
    return {
      ...data,
      datas: dataProduct
    }
  });

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
      {/* table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              ) */}

      <div className="my-4">
        <Button variant="default" className="ml-auto" onClick={onAdd}>
            <IoMdAdd  className="mr-2"/> Tambah
        </Button>
      </div>
      <EditDataTable columns={columns} table={table} >
        {editingRowId == 'tambah' && (
          <TableRow key={editingRowId}>
            <TableCell colSpan={tableColumnsCount + 1}>
                {children}
              <Separator className="mt-4"/>
            </TableCell>
          </TableRow>
        )}
        {rowData.length > 0 ? rowData.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
          >
            {row.datas.id != editingRowId ? (
                row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={`${cell.column.id === 'action' && 'w-12 text-center'}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))
            ) : (
                <TableCell colSpan={row.getVisibleCells().length}>
                  {children}
            </TableCell>
            )}
          </TableRow>
        )) : ''}
        {
          (editingRowId != 'tambah' && !table.getRowModel().rows?.length) && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Data Kosong
              </TableCell>
            </TableRow>
          )
        }
      </EditDataTable>
      <FooterTable table={table} />
    </>
  )
}
