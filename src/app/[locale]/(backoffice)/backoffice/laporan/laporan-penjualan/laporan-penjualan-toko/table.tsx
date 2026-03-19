"use client"

import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { DataTable } from "@/components/organisms/DataTable"
import { ReportSalesByLocationColumnShow } from "./column"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[],
}

export function ReportSalesByLocationTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		state: {
			columnVisibility: ReportSalesByLocationColumnShow,
			columnFilters: [],
		},
	})

	return (
		<DataTable columns={columns} table={table} />
	)
};

