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
import HeaderTable from "@/components/organisms/HeaderTable"
import { DataTable } from "@/components/organisms/DataTable"
import { Button } from "@/components/ui/button"
import { IoMdAdd } from "react-icons/io"
import { RiExportFill, RiImportFill } from "react-icons/ri"
import ImportProduk from "./import"
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import FooterTableServer from "@/components/organisms/FooterTableServer"
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple"
import ProductCategoryDropdownSelect from "@/components/templates/Dropdowns/product-category-dropdown"
import { FaFileExcel } from "react-icons/fa"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  isPending: boolean,
  detailData: any,
  columnShow: any,
  onSetLimit: (limit: number) => void,
  onSetPage: (page: number) => void,
  onSetKeyword: (keyword: string) => void,
  onSetSelectAllProductCategory?: (selectAllLocation: boolean) => void,
  onSetProductCategoryIds?: (ids: number[]) => void,
  onSetExcludeProductCategoryIds?: (ids: number[]) => void,
  onRefetch: () => void,
  onExport: () => void,
  onAdd: () => void
}

export function ProductTable<TData, TValue>({
  columns,
  data,
  columnShow,
  isPending,
  detailData,
  onSetLimit,
  onSetPage,
  onSetKeyword,
  onSetSelectAllProductCategory,
  onSetProductCategoryIds,
  onSetExcludeProductCategoryIds,
  onRefetch,
  onExport,
  onAdd
}: DataTableProps<TData, TValue>) {
  const [open, setOpen] = useState(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      columnVisibility: columnShow,
      columnFilters: [],
    },
  })

  const onClose = () => {
    onRefetch();
    setOpen(false);
  }

  return (
    <>
      <HeaderTable table={table} url={''}> 
        <Input
          placeholder="Filter name..."
          onChange={(event) =>
            onSetKeyword(event.target.value)
          }
          className="max-w-xs"
        />
        <div className="flex flex-col gap-2">
          <ProductCategoryDropdownSelect
            multiSelect={true}
            defaultSelectAll={true}
            handleSelectAllChange={onSetSelectAllProductCategory}
            handleExcludeIdsChange={onSetExcludeProductCategoryIds}
            handleIdsChange={onSetProductCategoryIds}
            key="1"
          />
        </div>
      </HeaderTable>

      <div className="my-4 flex justify-between">
        <Button variant="default" onClick={onAdd}>
            <IoMdAdd className="mr-2"/> Tambah Produk
        </Button>
        <div className="flex gap-4">
          <Button variant="default" onClick={onExport}>
              <FaFileExcel className="mr-2"/> Export
          </Button>
            {/* <a href="/templates/template-product.xlsx" download="Template">
              <Button variant="ghost" className="border border-primary text-primary">
                  <RiExportFill  className="mr-2"/> Unduh Template
              </Button>
            </a> */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                  <Button variant="ghost" className="border border-primary text-primary">
                    <RiImportFill  className="mr-2"/> Import Produk
                </Button>
              </DialogTrigger>
              <ImportProduk onClose={onClose}/>
            </Dialog>
        </div>
      </div>

      {
        (isPending) ? <SkeletonSimple /> : <DataTable columns={columns} table={table} />
      }

      <FooterTableServer
          rowCount={detailData?.total}
          currentPage={detailData?.currentPage}
          lastPage={detailData?.lastPage}
          hasPrev={detailData?.hasPrev}
          hasNext={detailData?.hasNext}
          setPageSize={onSetLimit}
          setPage={onSetPage}
      />
    </>
  )
}
