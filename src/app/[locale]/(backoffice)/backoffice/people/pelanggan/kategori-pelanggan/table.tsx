"use client"

import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable, VisibilityState } from "@tanstack/react-table"
import { useState } from "react"
import { DataTable } from "@/components/organisms/DataTable"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[],
	columnShow: any,
	rowCount: number,
	isFetching: boolean,
	setPageSize: (page: number) => void,
}

export function CustomerCategoryTable<TData, TValue>({
	columns,
	data,
	columnShow,
	rowCount,
	isFetching,
	setPageSize,
}: DataTableProps<TData, TValue>) {
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(columnShow)
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    // const { data, isFetching, refetch } = useGetCustomerCategoriesQuery({ search: '', limit: 1 });

	// const x = function(x: AxiosResponse<any, any> | undefined): TData[] {
	// 	return x?.data
	// }
	// const y = x(data)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		// onColumnVisibilityChange: setColumnVisibility,
		// onColumnFiltersChange: setColumnFilters,
		// getFilteredRowModel: getFilteredRowModel(),
		// getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		// onPaginationChange:
		state: {
			columnVisibility,
			columnFilters,
		},
	})

	return (
		<>
			{/* {
				isFetching ? <DataTable columns={columns} table={table} /> : <SkeletonDataTable />
			} */}
			<DataTable columns={columns} table={table} />
		</>
	)
};

