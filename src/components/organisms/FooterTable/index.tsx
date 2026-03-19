import { Button } from "@/components/ui/button";
import { useReactTable } from "@tanstack/react-table";

interface FooterTableProps<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
}

function FooterTable<TData>({ table }: FooterTableProps<TData>) {
  return (
    <div className="w-full flex items-center justify-between space-x-2 py-4">
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
      <span>
        Data <strong>{table.getRowCount()}</strong> - Halaman{" "}
        <strong>
          {table.getState().pagination.pageIndex + 1} dari{" "}
          {table.getPageCount()}
        </strong>{" "}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}

export default FooterTable;
