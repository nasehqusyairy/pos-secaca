import { FC, useEffect, useState } from "react";

import { useGetCashierEmployeesQuery } from "@/app/api/karyawan/queries";
import { Kasir } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoSearch } from "react-icons/io5";

interface EnployeePopupProps {
    isTriggerOpen: boolean;
    onClose: () => void;
    onSubmit: (customer: Kasir) => void
    location_id: number
}
 
const EnployeePopup: FC<EnployeePopupProps> = (props) => {
    const {isTriggerOpen, onClose, onSubmit, location_id} = props

    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [autoSelectedValue, setAutoSelectedValue] = useState("");

    const {data, isPending} = useGetCashierEmployeesQuery(100, location_id, nextUrl);

    const onSelectKasir = () => {
        if (!value && !autoSelectedValue) return

        const kasirData = data?.data.find((data: any) => data.name === value || data.name === autoSelectedValue);

        onSubmit(kasirData)
    }

    useEffect(() => {
        setValue("")
    }, [isTriggerOpen]);

    useEffect(() => {
        if (!autoSelectedValue) return

        onSelectKasir()
    }, [autoSelectedValue]);

    useEffect(() => {
        if (!isPending && data && data.data && data.data.length > 0) {
            setAutoSelectedValue(data.data[0].name)
        }
    }, [isPending]);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 ${isTriggerOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            {/* Popup Header */}
            <p className="text-lg md:text-2xl font-semibold">Sales</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">Masukkan Sales yang sedang melakukan transaksi.</p>

            {/* Popup Body */}
            <div className="flex flex-col items-center gap-6 mt-6">
                <Popover open={open} onOpenChange={setOpen} >
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="justify-start gap-2 md:gap-4 w-[22rem] text-xs md:text-base"
                        >
                            <IoSearch className="md:ml-2 h-4 w-4 shrink-0" />
                            {value
                            ? data?.data.find((data: any) => data.name === value)?.name
                            : "Cari sales ..."}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[22rem] p-0">
                    <Command>
                        <CommandInput className="text-xs md:text-base" placeholder="Cari sales..." />
                        <CommandList>
                        <CommandEmpty className="text-xs md:text-base" >sales tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {isPending ? (
                            <CommandItem className="flex justify-center text-xs md:text-base">
                                Memuat data ....
                            </CommandItem>
                            ) : (
                            data?.data.map((data: any) => (
                                <CommandItem
                                    key={data.id}
                                    value={data.name}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue);
                                        setAutoSelectedValue('')
                                        setOpen(false);
                                    }}
                                    className="text-xs md:text-base" 
                                >
                                    {data.name}
                                </CommandItem>
                            ))
                            )}
                        </CommandGroup>
                        </CommandList>
                    </Command>
                    </PopoverContent>
                </Popover>
                
                <div className="flex gap-2">
                    <Button variant="default" className="text-xs md:text-base" onClick={onSelectKasir}>Pilih sales</Button>
                    <Button variant="secondary" className="text-xs md:text-base" onClick={onClose}>Kembali</Button>
                </div>
            </div>
          </div>
        </div>
    )
}
 
export default EnployeePopup;