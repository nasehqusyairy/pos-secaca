"use client"

import { useGetCatalogueQuery } from "@/app/api/catalogues/query";
import { Stock } from "@/app/api/product/kasir-product/type";
import { Product } from "@/app/api/product/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { capitalizeWords } from "@/lib/helpers";
import { cn, formatRupiah } from "@/lib/utils";
import { FC, useRef, useState } from "react";

const INVOICE_COLUMN = ["No", "Nama Produk", "Lokasi", "Stok"];

interface TableBarangProps {
    onClickDetail: (id: number, isDetail: boolean) => void;
    locId: number;
    dataProducts: Stock[];
}
 
const TableBarang: FC<TableBarangProps> = ({
    onClickDetail,
    locId,
    dataProducts,
}) => {
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    const [state, setState] = useState<string>('DEFAULT');
    const inputSearch = useRef<HTMLInputElement>(null);
    const [idProduct, setIdProduct] = useState<number>(0);

    const {data: searchResult} = useGetCatalogueQuery(locId, searchTerm)

    const handleKeyDownSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        console.log('event.target.value', event.key == 'Enter', event.key)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };

    const onSearch = (dataSearch: string | undefined = inputSearch?.current?.value) => {
        setIdProduct(0)

        if (dataSearch) {
            setSearchTerm(dataSearch)
            setState('SEARCH')
        }
    }

    const onSearchProduct = (id: number) => {
        setState('DETAIL')
        onClickDetail(id, false)
        setIdProduct(id)
    }

    const onClickDetailProduct = (id: number) => {
        onClickDetail(id, true)
        setIdProduct(id)
    }

    const rowClassNameActive = (id: number) => {
        return cn({
            'bg-blue-50': id == idProduct,
            'hover:cursor-pointer': true
        })
    }

    return ( 
        <>
            <div className="flex gap-2 w-full">
                <Input
                    ref={inputSearch}
                    type="text"
                    placeholder="Cari produk..."
                    onKeyDown={handleKeyDownSearch}
                    onChange={handleInputChange}
                    className="text-xs md:text-base"
                />
                {/* <Button type="button" onClick={onSearch}>
                    Cari
                </Button> */}
            </div>

            {
                state === 'DEFAULT' && idProduct === 0 ? (
                    <p className="mt-10 text-xs md:text-base">Silahkan cari barang terlebih dahulu!</p>
                ) : state === 'SEARCH' ? (
                    <div className="w-full mt-4">
                        {
                            searchResult ? (
                                searchResult.map((data: Product) => (
                                    <div className="rounded border border-blue-400 p-2 text-xs md:text-sm mb-4 cursor-pointer hover:bg-blue-50" key={data.id} onClick={() => onSearchProduct(data.id as number)}>
                                        <p className="mb-2 font-semibold">{data?.name} # {data?.barcode}</p>
                                        <p className="text-slate-500">Stock: {formatRupiah((data?.product_location_stock?.stock))}</p>
                                        {/* <p className="text-slate-500">HPP: {formatRupiah((data?.product_location_stock?.average_buy_price))}</p> */}
                                        <p className="text-slate-500">Harga Jual: {formatRupiah(parseInt(data?.sell_price))}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs md:text-base">Maaf, barang yang anda cari tidak ada</p>
                            )
                        }
                    </div>
                ) : (
                    <div>
                    </div>
                )
            }

            {
                idProduct !== 0 && (
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
                                    {dataProducts?.length > 0 ? dataProducts.map((item: Stock, i: number) => {
                                        return (
                                            <TableRow className={rowClassNameActive(item.id)} key={i} onClick={() => onClickDetailProduct(item?.id)} >
                                                <TableCell className="text-xs md:text-base" >{i + 1}</TableCell>
                                                <TableCell className="text-xs md:text-base" >{item?.product?.name}</TableCell>
                                                <TableCell className="text-xs md:text-base" >{capitalizeWords(item?.location?.name)}</TableCell>
                                                <TableCell className="text-xs md:text-base" >{item?.stock}</TableCell>
                                                {/* <TableCell>{item?.product_unit?.name}</TableCell> */}
                                            </TableRow>
                                        )
                                    }
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-xs md:text-base text-center">
                                                Data tidak ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                </div>
                )
            }
        </>
     );
}
 
export default TableBarang;