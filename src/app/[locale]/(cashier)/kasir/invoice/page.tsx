"use client";

import { FC, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import TableInvoicePage from "./table-invoice";
import { useGetInvoiceDetailQuery, useGetInvoicesQueryWithCursor } from "@/app/api/invoice/query";
import { Badge } from "@/components/ui/badge";
import { formatDateToStringDate } from "@/lib/helpers";
import { formatRupiah } from "@/lib/utils";
import { FaPrint } from "react-icons/fa";
import { HiReceiptRefund } from "react-icons/hi";
import { useRouter } from "next/navigation";
import SkeletonKasirPage from "@/components/organisms/Skeleton/SkeletonKasir";
import { useTranslations } from "next-intl";
import { Customer } from "@/types/order";
import { Employee } from "@/app/api/karyawan/type";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GetInvoicesQueryParams } from "@/types/invoice";
import { AiFillProduct } from "react-icons/ai";
import { TbFileInvoice } from "react-icons/tb";

interface InvoicePageProps {}

const InvoicePage: FC<InvoicePageProps> = () => {
  const t = useTranslations();
  const router = useRouter();

  // Inisialisasi locId langsung dari localStorage saat pertama kali render (lazy init)
  const [locId, setLocId] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedLoc = localStorage.getItem("location");
        if (storedLoc) {
          const parsed = JSON.parse(storedLoc);
          return parsed?.id ?? 0;
        }
      } catch {
        return 0;
      }
    }
    return 0;
  });

  const [idInvoice, setIdInvoice] = useState<number>(0);
  const [isGetDetail, setIsGetDetail] = useState<boolean>(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const [filterSales, setFilterSales] = useState<string>('my');
  const [menuMobile, setMenuMobile] = useState<string>('invoice');

  // Fallback sinkronisasi localStorage jika saat inisialisasi awal belum terbaca
  useEffect(() => {
    try {
      const locationData = localStorage.getItem("location");
      if (locationData) {
        const parsed = JSON.parse(locationData);
        if (parsed?.id && parsed.id !== locId) {
          setLocId(parsed.id);
        }
      }
    } catch {
      // Abaikan error parsing
    }
  }, [locId]);

  const getInvoicesQueryParams = {
    limit: 10,
    locs: locId > 0 ? [locId] : [],
    refund_amount: -1,
    only_logged_cashier: filterSales === 'my',
    keyword,
    cursor,
  } as GetInvoicesQueryParams;

  const {
    data: dataInvoicesWithCursor,
    isPending: isPendingInvoices,
    refetch: refetchInvoices
  } = useGetInvoicesQueryWithCursor(getInvoicesQueryParams);

  const {
    data: dataInvoiceDetails,
    isPending: isPendingInvoice,
    refetch: refetchInvoiceDetail
  } = useGetInvoiceDetailQuery(idInvoice);

  const dataAll = dataInvoicesWithCursor?.data ?? [];
  const nextCursor = dataInvoicesWithCursor?.nextCursor;
  const prevCursor = dataInvoicesWithCursor?.prevCursor;

  // Set ID invoice pertama sebagai default saat data invoices masuk
  useEffect(() => {
    if (dataAll.length > 0) {
      setIdInvoice(dataAll[0].id);
    }
  }, [dataAll]);

  // Refetch detail setiap kali idInvoice berubah
  useEffect(() => {
    if (idInvoice > 0) {
      refetchInvoiceDetail();
    }
  }, [idInvoice]);

  // Trigger refetch list invoice secara otomatis saat filter, keyword, kursor, atau locId berubah
  useEffect(() => {
    refetchInvoices();
  }, [cursor, keyword, locId, filterSales]);

  const handleNextPage = (cursorTarget?: string) => {
    setCursor(cursorTarget ?? nextCursor);
  };

  const handlePrevPage = (cursorTarget?: string) => {
    setCursor(cursorTarget ?? prevCursor);
  };

  const onClickDetail = (id: number) => {
    setIdInvoice(id);
    setIsGetDetail(true);
    setMenuMobile('daftar');
  };

  const onClickRefund = (id: number) => {
    router.push(`refund/${id}`);
  };

  const dataInvoiceDetail = dataInvoiceDetails ?? null;

  const additionalFee = (amount?: number, label?: string) => {
    if (!amount || amount === 0) {
      return <></>;
    }

    return (
      <div className="flex justify-between mt-2">
        <p className="text-sm">{label}</p>
        <p className="text-sm font-bold">{formatRupiah(amount)}</p>
      </div>
    );
  };

  const memberLabel = (member?: Customer) => {
    if (!member) {
      return '-';
    }
    return `${member.first_name || ''} ${member.last_name || ''}`.trim() || '-';
  };

  const employeeLabel = (member?: Employee) => {
    if (!member) {
      return '-';
    }
    return `${member.first_name || ''} ${member.last_name || ''}`.trim() || '-';
  };

  const totalHarga = (detail: any) => {
    let total = detail?.net_sales_after_tax ?? 0;
    total += detail?.payment_platform_fee ?? 0;
    return total;
  };

  const onPrint = (id: string | number) => {
    const pdfUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/sale_transactions/${id}/pdf`;
    window.open(pdfUrl, 'PRINT', "height=400,width=600");
  };

  if (isPendingInvoices) return <SkeletonKasirPage />;

  return (
    <main className="w-auto md:flex md:justify-center md:gap-4 md:pb-20">
      <section className={`p-4 md:p-0 md:w-1/2 md:block ${menuMobile === 'invoice' ? 'block' : 'hidden'}`}>
        <div className="w-full md:flex md:flex-col md:justify-center md:items-center">
          <TableInvoicePage
            data={dataAll}
            onFilterSalesSearch={setFilterSales}
            onSearch={setKeyword}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onClickDetail={onClickDetail}
            nextCursor={nextCursor}
            prevCursor={prevCursor}
            idActive={idInvoice}
          />
        </div>
      </section>

      <section className={`border rounded-lg md:w-1/2 xl:w-1/3 md:overflow-y-auto md:sticky md:top-10 md:min-h-[calc(100vh-120px)] md:overflow-x-hidden md:block ${menuMobile === 'daftar' ? 'block' : 'hidden'}`}>
        <div className="font-semibold text-base md:text-lg bg-primary p-4 text-white flex justify-between items-center">
          <p>
            {dataInvoiceDetail?.sales_no ?? '-'}
          </p>
          <Badge className="bg-white text-primary">
            {dataInvoiceDetail?.local_paid_at && formatDateToStringDate(new Date(dataInvoiceDetail?.local_paid_at), true)}
          </Badge>
        </div>

        {isGetDetail && isPendingInvoice ? (
          <p className="text-xs md:text-base p-4">Memuat data...</p>
        ) : (
          <div className="p-4">
            <p className="text-sm md:text-base font-semibold">{dataInvoiceDetail?.location?.name ?? '-'}</p>
            <div className="w-2/3 mt-2 text-slate-600">
              <table className="w-full text-xs md:text-sm">
                <tbody>
                  <tr>
                    <td className="pr-4">Member</td>
                    <td>: {memberLabel(dataInvoiceDetail?.customer)}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Kasir</td>
                    <td>: {employeeLabel(dataInvoiceDetail?.cashier)}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Sales</td>
                    <td>: {employeeLabel(dataInvoiceDetail?.employee_sales)}</td>
                  </tr>
                  <tr>
                    <td>Catatan</td>
                    <td>: {dataInvoiceDetail?.notes ?? '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-10">
              <p className="text-sm md:text-base font-semibold">
                Daftar produk ({dataInvoiceDetail?.sale_transaction_details?.length ?? 0})
              </p>
              <ScrollArea style={{ height: '150px' }}>
                {dataInvoiceDetail?.sale_transaction_details && dataInvoiceDetail.sale_transaction_details.map((item: any, i: number) => {
                  return (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between mt-2">
                        <p className="text-sm font-semibold">{item?.product_name}</p>
                        <p className="text-sm font-bold">{formatRupiah(item?.quantity * item?.sell_price)}</p>
                      </div>
                      <div>
                        <p className="text-xs">{item?.quantity} x {formatRupiah(item?.sell_price)}</p>
                      </div>
                      {additionalFee(item?.discount_amount * -1, t('adjustment_discount'))}
                      {additionalFee(item?.surcharge_amount, t('adjustment_surcharge'))}
                    </div>
                  );
                })}
                <ScrollBar />
              </ScrollArea>

              <Separator className="my-2" />
              <div className="flex justify-between mt-2">
                <p className="text-xs md:text-sm font-semibold">{t('subtotal')}</p>
                <p className="text-xs md:text-sm font-bold">{formatRupiah(dataInvoiceDetail?.subtotal)}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-xs md:text-sm font-semibold">Total Barang</p>
                <p className="text-xs md:text-sm font-bold">
                  {dataInvoiceDetail?.sale_transaction_details?.reduce((n: number, item: any) => n + item?.quantity, 0) ?? 0}
                </p>
              </div>
              {additionalFee(dataInvoiceDetail?.surcharge_amount, t('adjustment_surcharge'))}
              {additionalFee(((dataInvoiceDetail?.discount_amount ?? 0) + (dataInvoiceDetail?.promo_amount ?? 0)) * -1, t('adjustment_discount'))}
              {additionalFee(dataInvoiceDetail?.payment_platform_fee, t('adjustment_fee'))}
              <div className="flex justify-between mt-2">
                <p className="text-xs md:text-sm font-semibold">Grand total</p>
                <p className="text-xs md:text-sm font-bold">{formatRupiah(totalHarga(dataInvoiceDetail))}</p>
              </div>
            </div>

            {dataInvoiceDetail?.sale_refunds && (
              <div className="mt-10">
                {dataInvoiceDetail.sale_refunds.length > 0 && (
                  <p className="text-sm md:text-base font-semibold mb-2">Daftar Pengembalian</p>
                )}
                {dataInvoiceDetail.sale_refunds.map((item: any, i: number) => {
                  return (
                    <div key={i}>
                      <p className="text-xs md:text-sm">
                        Tanggal Pengembalian: {item?.refund_at && formatDateToStringDate(new Date(item?.refund_at), true)}
                      </p>
                      {item.sale_refund_details && item.sale_refund_details.map((refundItem: any, idx: number) => (
                        <div key={idx} className="flex justify-between mt-2">
                          <p className="text-xs md:text-sm">{refundItem?.product_name}</p>
                          <p className="text-xs md:text-sm">{refundItem?.quantity} x {formatRupiah(refundItem?.sell_price)}</p>
                        </div>
                      ))}
                      <Separator className="my-2" />
                    </div>
                  );
                })}
              </div>
            )}

            {idInvoice !== 0 && dataInvoiceDetail && (
              <div className="bottom-2 right-2 w-full mt-4">
                <Separator className="my-2" />
                <div className="flex justify-end gap-2">
                  <Button type="button" className="bg-yellow-400 hover:bg-yellow-500" onClick={() => onPrint(dataInvoiceDetail.id)}>
                    <FaPrint className="mr-2" />
                    <p className="font-semibold text-xs md:text-base">Cetak</p>
                  </Button>
                  {dataInvoiceDetail.sale_refunds?.length === 0 && (
                    <Button type="button" onClick={() => onClickRefund(dataInvoiceDetail.id)}>
                      <HiReceiptRefund className="mr-2" />
                      <p className="font-semibold text-xs md:text-base">Pengembalian</p>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Section Menu for mobile UI */}
      <div className="md:hidden fixed bottom-8 w-full bg-white p-2">
        <div className="flex justify-between items-center">
          <Button
            type="button"
            className="w-1/2"
            variant="ghost"
            onClick={() => setMenuMobile('invoice')}
          >
            <p className={`text-xs md:text-base ${menuMobile === 'invoice' ? 'text-primary' : ''} flex items-center gap-1`}>
              <AiFillProduct /> List Struk
            </p>
          </Button>
          <Button
            type="button"
            className="w-1/2"
            variant="ghost"
            onClick={() => setMenuMobile('daftar')}
          >
            <p className={`text-xs md:text-base ${menuMobile === 'daftar' ? 'text-primary' : ''} flex items-center gap-1`}>
              <TbFileInvoice /> Detail Struk
            </p>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default InvoicePage;