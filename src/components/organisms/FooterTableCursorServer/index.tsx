import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface FooterTableCursorServerProps<TData> {
  nextCursor: string,
  prevCursor: string,
  setPageSize: (page: number) => void;
  setCursor: (cursor: string) => void;
}

function FooterTableCursorServer<TData>(param: FooterTableCursorServerProps<TData>) {
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
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => param.setCursor(param.prevCursor)}
          disabled={!param.prevCursor}
        >
          {t('previous_page')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => param.setCursor(param.nextCursor)}
          disabled={!param.nextCursor}
        >
          {t('next_page')}
        </Button>
      </div>
    </div>
  );
}

export default FooterTableCursorServer;
