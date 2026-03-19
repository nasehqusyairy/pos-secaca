import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface FooterTableServerProps<TData> {
  rowCount: number,
  currentPage: number,
  lastPage: number,
  hasPrev: boolean,
  hasNext: boolean,
  setPageSize: (page: number) => void;
  setPage: (page: number) => void;
}

function FooterTableServer<TData>(param: FooterTableServerProps<TData>) {
  const t = useTranslations();

  return (
    <div className="w-full flex items-center justify-between space-x-2 py-4">
      <select
        // value={table.getState().pagination.pageSize}
        onChange={(e) => {
          param.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
      <span className="text-sm">
        <span className="hidden sm:inline">
          {t('data')} <strong>{param.rowCount}</strong> - {`${t('pages')} `}
        </span>
        <strong>
          {param.currentPage} dari{" "}
          {param.lastPage}
        </strong>
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => param.setPage(Number(param.currentPage) - 1)}
          disabled={!param.hasPrev}
        >
          {t('previous_page')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => param.setPage(Number(param.currentPage) + 1)}
          disabled={!param.hasNext}
        >
          {t('next_page')}
        </Button>
      </div>
    </div>
  );
}

export default FooterTableServer;
