"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FC, useEffect, useState } from "react";

interface PopupFilterInvoiceParam {
  isTriggerOpen: boolean;
  currentFilter?: string;
  onClose: (open: boolean) => void;
  onSearch: (search: string) => void;
}

const PopupFilterInvoicePage: FC<PopupFilterInvoiceParam> = ({
  isTriggerOpen,
  currentFilter = "my",
  onSearch,
  onClose,
}) => {
  const [filter, setFilter] = useState<string>(currentFilter);

  // Sinkronkan pilihan filter dengan nilai aktif saat popup dibuka
  useEffect(() => {
    if (isTriggerOpen) {
      setFilter(currentFilter);
    }
  }, [isTriggerOpen, currentFilter]);

  const onSelectFilter = () => {
    onSearch(filter);
    onClose(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 ${
        isTriggerOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <p className="text-lg md:text-2xl font-semibold">Filter</p>

        <div className="my-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Jenis Penjualan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="my" className="text-sm md:text-base">
                Penjualan Saya
              </SelectItem>
              <SelectItem value="all" className="text-sm md:text-base">
                Semua Penjualan
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" className="text-xs md:text-base" onClick={() => onClose(false)}>
            Tutup
          </Button>
          <Button variant="default" className="text-xs md:text-base" onClick={onSelectFilter}>
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupFilterInvoicePage;