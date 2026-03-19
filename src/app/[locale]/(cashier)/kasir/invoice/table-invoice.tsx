import { Employee } from "@/app/api/karyawan/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatRupiah } from "@/lib/utils";
import { InvoiceModel } from "@/types/invoice";
import { FC, useState } from "react";
import PopupFilterInvoicePage from "./popup-filter-invoice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CogIcon } from "lucide-react";


const INVOICE_COLUMN = ["No", "No Penjualan", "Kasir", "Total Harga", "Total Pengembalian"];


interface TableInvoicePageProps {
    data: InvoiceModel[];
    onFilterSalesSearch: (search: string) => void;
    onSearch: (search: string) => void;
    onNextPage: (cursor?: string) => void;
    onPrevPage: (cursor?: string) => void;
    nextCursor?: string,
    prevCursor?: string,
    onClickDetail: (id: number) => void;
    idActive: number;
}

const TableInvoicePage: FC<TableInvoicePageProps> = ({
    data,
    onFilterSalesSearch,
    onSearch,
    onNextPage,
    onPrevPage,
    nextCursor,
    prevCursor,
    onClickDetail,
    idActive
}) => {
    const [openFilter, setOpenFilter] = useState<boolean>(false);

    const rowClassNameActive = (id: number) => {
        return cn({
            'bg-blue-50': id === idActive,
            'hover:cursor-pointer': true
        })
    }

    const totalHarga = (dataInvoiceDetail: InvoiceModel) => {
        let total = dataInvoiceDetail.net_sales_after_tax ?? 0
        total += dataInvoiceDetail.payment_platform_fee ?? 0

        return formatRupiah(total)
    }

    const employeeLabel = (member?: Employee) => {
        if (!member) {
            return '-'
        }

        return member.first_name + ' ' + member.last_name
    }

    const next = () => {
        onNextPage()
    }

    const prev = () => {
        onPrevPage()
    }

    const handleFilterSalesSearch = (filter: string) => {
        setOpenFilter(false)
        onFilterSalesSearch(filter)
    }
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };

    return (
        <>
            <div className="flex gap-2 w-full">
                <Input
                    type="text"
                    placeholder="Cari invoice..."
                    onChange={handleInputChange}
                    className="text-xs md:text-base"
                />
                <Button onClick={() => setOpenFilter(prev => !prev)} className="text-xs md:text-base">
                    <CogIcon />
                </Button>
            </div>

            <div className="md:border md:rounded-md w-full mt-4">
                <ScrollArea className="w-[22rem] md:w-full whitespace-nowrap rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="p-2 font-semibold">
                                {INVOICE_COLUMN.map(
                                    (item: string, i: number) => (
                                        <TableHead className="text-xs md:text-base" key={item + i}>{item}</TableHead>
                                    )
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? data.map((item: InvoiceModel, i: number) => {
                                return (
                                    <TableRow className={rowClassNameActive(item.id)} key={i} onClick={() => onClickDetail(item?.id)} >
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{item.sales_no}</TableCell>
                                        <TableCell>{employeeLabel(item.cashier)}</TableCell>
                                        <TableCell>{totalHarga(item)}</TableCell>
                                        <TableCell>{formatRupiah(item.refunded_amount)}</TableCell>
                                    </TableRow>
                                )
                            }
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={INVOICE_COLUMN.length} className="text-center text-xs md:text-base">
                                        Data tidak ditemukan
                                    </TableCell>
                                </TableRow>
                            )}
                            <TableRow>
                                <TableCell colSpan={INVOICE_COLUMN.length} className="text-center">
                                    <div className="flex justify-between">
                                        <Button type="button" className="text-xs md:text-base" onClick={prev} disabled={prevCursor == undefined}>
                                            Sebelum
                                        </Button>
                                        <Button type="button" className="text-xs md:text-base" onClick={next} disabled={nextCursor == undefined}>
                                            Selanjutnya
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    
                
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            <PopupFilterInvoicePage
                isTriggerOpen={openFilter}
                onClose={setOpenFilter}
                onSearch={ handleFilterSalesSearch }
            />
        </>
    );
}

export default TableInvoicePage;