"use client"

import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { DataTable } from "@/components/organisms/DataTable"
import { ReportSalesColumnShow } from "./column"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[],
}

export function ReportSalesTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		state: {
			columnVisibility: ReportSalesColumnShow,
			columnFilters: [],
		},
	})

	return (
		<DataTable columns={columns} table={table} />
	)
};

