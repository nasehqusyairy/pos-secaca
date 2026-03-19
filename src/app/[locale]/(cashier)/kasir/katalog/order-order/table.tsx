"use client"

import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { DataTable } from "@/components/organisms/DataTable"
import { OpenOrderColumnhow } from "./column"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[],
}

export function OpenOrderTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		state: {
			columnVisibility: OpenOrderColumnhow,
			columnFilters: [],
		},
	})

	return (
		<>
			<ScrollArea style={{height: '450px'}}>
				<DataTable columns={columns} table={table} />
			</ScrollArea>
		</>
	)
};

