"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FC, useState } from "react";

interface PopupFilterInvoiceParam {
    isTriggerOpen: boolean,
    onClose: (open: boolean) => void;
    onSearch: (search: string) => void;
}

const PopupFilterInvoicePage: FC<PopupFilterInvoiceParam> = (props) => {
    const { isTriggerOpen, onSearch, onClose } = props

    const [filter, setFilter] = useState<string>('my');

    const onSelectFilter = () => {
        onSearch(filter)
    }

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 ${isTriggerOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                {/* Popup Header */}
                <p className="text-lg md:text-2xl font-semibold">Filter</p>

                {/* Popup Body */}
                <div className="my-2 mb-4">
                    <div>
                        <Select value={ filter } onValueChange={setFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenis Penjualan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    key={'my'}
                                    value={'my'}
                                    className="text-sm md:text-base"
                                >
                                    Penjualan Saya
                                </SelectItem>
                                <SelectItem
                                    key={'all'}
                                    value={'all'}
                                    className="text-sm md:text-base"
                                >
                                    Semua Penjualan
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Popup Footer */}
                <div className="flex gap-2">
                    <Button variant="default" className="text-xs md:text-base" onClick={onSelectFilter}>Filter</Button>
                    <Button variant="secondary" className="text-xs md:text-base" onClick={() => onClose(false)}>Tutup</Button>
                </div>
            </div>
        </div>
    );
}

export default PopupFilterInvoicePage;