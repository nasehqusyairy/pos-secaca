"use client";

import { FC, useEffect, useState } from "react";
import { formatRupiah } from "@/lib/utils";
import TableBarang from "./table-barang";
import { useGetCashierProductDetailQuery, useGetCashierProductQuery } from "@/app/api/product/queries";
import { capitalizeWords, formatDateToStringDate } from "@/lib/helpers";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ProductStockMovement } from "@/app/api/product/kasir-product/type";
import { Button } from "@/components/ui/button";
import { AiFillProduct } from "react-icons/ai";
import { FaBoxArchive } from "react-icons/fa6";

interface BarangPageProps {}

const BarangPage: FC<BarangPageProps> = () => {
  const [idProduct, setIdProduct] = useState<number>(0);
  const [idProductDetail, setIdProductDetail] = useState<number>(0);
  const [locId, setLocId] = useState<number>(0);
  const [menuMobile, setMenuMobile] = useState<string>('product');

  const {data: dataProducts} = useGetCashierProductQuery(100, idProduct)
  const {data: product} = useGetCashierProductDetailQuery(idProductDetail)

  useEffect(() => {
    const location = JSON.parse(localStorage.getItem("location") as string);
    if(location) {
      setLocId(location.id)
    }
  }, [])

  const onClickDetail = (id: number, isDetail: boolean) => {
    if (!id) return;

    if (!isDetail) {
      setIdProduct(id)
    } else {
      setIdProductDetail(id)
      setMenuMobile('daftar')
    }
  }

  return (
    <main className="w-auto md:flex md:justify-center md:gap-4 md:pb-20">
      <section className={`p-4 md:p-0 md:w-1/2 md:block ${menuMobile === 'product' ? 'block' : 'hidden'}`}>
        <div className="w-full md:flex md:flex-col md:justify-center md:items-center">
            <TableBarang onClickDetail={onClickDetail} locId={locId} dataProducts={dataProducts}/>
        </div>
      </section>

      <section className={`border rounded-lg md:w-1/2 xl:w-1/3 md:overflow-y-auto md:sticky md:top-10 md:min-h-[calc(100vh-120px)] md:overflow-x-hidden md:block ${menuMobile === 'daftar' ? 'block' : 'hidden'}`}>
        <div className="font-semibold text-base md:text-lg bg-primary p-4 text-white flex justify-between items-center">
          <p>Detail Produk</p>
        </div>
        {
            product && (
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                        <p>Nama Produk</p>
                        <p>: {product?.productLocationStock?.product?.name}</p>

                        <p>Barcode</p>
                        <p>: {product?.productLocationStock?.product?.barcode}</p>

                        <p>Lokasi</p>
                        <p>: {capitalizeWords(product?.productLocationStock?.location?.name)}</p>

                        <p>Produk Unit</p>
                        <p>: {product?.productLocationStock?.product_unit?.name}</p>

                        <p>Stok</p>
                        <p>: {product?.productLocationStock?.stock}</p>

                        <p>Stok masuk terakhir</p>
                        <p>: {product?.productLocationStock?.last_in_stock}</p>

                        <p>Stok keluar terakhir</p>
                        <p>: {product?.productLocationStock?.last_out_stock}</p>
                    </div>

                    {/* Detail looping  */}
                    <div className="mt-6">
                        <p className="text-sm md:text-base font-semibold">Daftar pergerakan stok produk</p>
                        <ScrollArea className="w-[22rem] md:w-full whitespace-nowrap rounded-md border mt-2">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="p-2 border-b text-xs md:text-sm text-start">Tanggal</th>
                                        <th className="p-2 border-b text-xs md:text-sm">Harga jual</th>
                                        {/* <th className="p-2 border-b text-xs md:text-sm">Harga beli</th> */}
                                        <th className="p-2 border-b text-xs md:text-sm">Stok Masuk</th>
                                        <th className="p-2 border-b text-xs md:text-sm">Stok Keluar</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs md:text-sm text-slate-700">
                                    {
                                         product?.productStockMovements && product?.productStockMovements.slice(-2).map((item: ProductStockMovement) => (
                                            <tr key={item.id} >
                                                <td className="p-2">{formatDateToStringDate(new Date(item?.created_at), true)}</td>
                                                <td className="p-2 border-b">{formatRupiah(item?.product?.sell_price as number)}</td>
                                                {/* <td className="p-2 border-b">{formatRupiah(item?.buying_price as number)}</td> */}
                                                <td className="p-2 border-b">{item?.stock_in}</td>
                                                <td className="p-2 border-b">{item?.stock_out}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>

                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                </div>
            )
      }

      </section>

      
      {/* Section Menu for mobile UI */}
      {
        <div className="md:hidden fixed bottom-8 w-full bg-white p-2">
          {/* menu 2, produk and daftar pesanan */}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              className="w-1/2"
              variant="ghost"
              onClick={() => setMenuMobile('product')}
            >
              <p className={`text-xs md:text-base ${menuMobile === 'product' && 'text-primary'} flex items-center gap-1`}><AiFillProduct /> List barang</p>
            </Button>
            <Button
              type="button"
              className="w-1/2"
              variant="ghost"
              onClick={() => setMenuMobile('daftar')}
            >
              <p className={`text-xs md:text-base ${menuMobile === 'daftar' && 'text-primary'} flex items-center gap-1`}><FaBoxArchive /> Detail barang</p>
            </Button>
          </div>
        </div>
      }
      
    </main>
  );
};

export default BarangPage;
