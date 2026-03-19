"use client"

import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { DataTable } from "@/components/organisms/DataTable"
import { LoyaltyColumnShow } from "./column"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[],
}

export function PromoTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		state: {
			columnVisibility: LoyaltyColumnShow,
			columnFilters: [],
		},
	})

	return (
		<DataTable columns={columns} table={table} />
	)
};

