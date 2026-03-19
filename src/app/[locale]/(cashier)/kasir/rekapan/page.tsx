"use client";

import { FC, useEffect, useState } from "react";
import { useGetSummaryQuery } from "@/app/api/summary/queries";
import { formatRupiah } from "@/lib/utils";
import { capitalizeWords } from "@/lib/helpers";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PiWarningCircleFill } from "react-icons/pi";
import { showConfirmationAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { useCreateSummaryMutation } from "@/app/api/summary/mutation";
import CalculatorCash from "./calculator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import SkeletonKasirPage from "@/components/organisms/Skeleton/SkeletonKasir";
import { PaymentSummary, SaleDataRequest } from "@/app/api/summary/type";
import { AiFillProduct } from "react-icons/ai";
import { TbListDetails } from "react-icons/tb";

interface RekapanPageProps { }

const RekapanPage: FC<RekapanPageProps> = () => {
    const [locId, setLocId] = useState<number>(0);
    const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({} as PaymentSummary);
    const [summary, setSummary] = useState<SaleDataRequest>();
    const [allPaymentSummary, setAllPaymentSummary] = useState<PaymentSummary[]>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [menuMobile, setMenuMobile] = useState<string>('rekap');

    const { data: dataSummary, refetch: refetchSummary, isPending: isPendingSummary } = useGetSummaryQuery(locId);
    const createSummary = useCreateSummaryMutation();

    let totalRecorded = 0;
    let totalCounted = 0;
    let totalDifferent = 0;

    useEffect(() => {
        const location = JSON.parse(localStorage.getItem("location") as string);
        if (location) {
            setLocId(location.id)
        }
    }, [])

    useEffect(() => {
        if (dataSummary) {
            setSummary(dataSummary);
        }

    }, [dataSummary]);

    useEffect(() => {
        if (!summary) return
        if (!summary.paymentSummaries) return

        setAllPaymentSummary(summary.paymentSummaries)
    }, [summary])

    const onHandleSubmit = () => {
        if (createSummary.isPending) return

        const payload = {
            ...summary,
            moneyMovementIds: null,
            customerDepositIds: null,
            isShift: false,
            locationId: locId,
            saleReferenceId: 1, // TODO Need to change this
            paymentSummaries: summary && summary.paymentSummaries.map(({ id, ...rest }) => ({
                ...rest,
                payment_method_id: id
            }))
        } as SaleDataRequest;

        showConfirmationAlert('Apakah kamu yakin untuk merekap?', '', 'Iya', 'batal', () => {
            createSummary.mutate(payload, {
                onSuccess: (data: any) => {
                    showToastSuccess("Berhasil Merekap Penjualan");
                    // clear store
                    refetchSummary()

                    const pdfUrl = process.env.NEXT_PUBLIC_API_URL + `/api/daily_sales/${data.data?.id}/pdf`
                    window.open(pdfUrl, 'PRINT', "height=400,width=600");
                },
                onError: () => {
                    showToastError("Gagal Merekap Penjualan");
                }
            });
        })
    }

    const onCloseCalculator = (payment: PaymentSummary) => {
        setSummary((prev) => {
            if (!prev) return prev;

            const updatedSummaries = prev.paymentSummaries.map((data) =>
                data.id === payment.id
                    ? {
                        ...data,
                        counted_amount: payment.counted_amount,
                        difference_amount: payment.recorded_amount - payment.counted_amount,
                    }
                    : data
            );

            return { ...prev, paymentSummaries: updatedSummaries };
        });

        setIsOpen(false);
    };

    const onOpenCalculator = (payment: PaymentSummary) => {
        setPaymentSummary(payment)
        setIsOpen(true)
    }

    if (isPendingSummary) return <SkeletonKasirPage />

    if (summary) {
        totalRecorded = summary.paymentSummaries.reduce((number: number, payment: PaymentSummary) => {
            const nominal = payment.recorded_amount ?? 0;
            return nominal + number;
        }, 0);
        totalCounted = summary.paymentSummaries.reduce((number: number, payment: PaymentSummary) => {
            const nominal = payment.counted_amount ?? 0;
            return nominal + number;
        }, 0);
        totalDifferent = summary.paymentSummaries.reduce((number: number, payment: PaymentSummary) => {
            const nominal = payment.difference_amount ?? 0;
            return nominal + number;
        }, 0);
    }

    return (
        <main className="w-auto md:flex md:justify-center md:gap-4 pb-20">
            <section className={`w-full md:w-1/2 p-4 md:p-0 md:block ${menuMobile === 'rekap' ? 'block' : 'hidden'}`}>
                <div className="w-full flex flex-col">
                    <div className="bg-yellow-100 rounded-md p-4">
                        {/* jelaskan rekapan penjualan itu apa */}
                        <h1 className="text-base md:text-xl font-semibold text-yellow-500">Rekap Penjualan</h1>
                        <p className="text-xs md:text-base text-slate-500">Rekap memastikan pembayaran yang dicatat untuk setiap transaksi seimbang dengan setiap jenis pembayaran yang diterima.</p>
                    </div>
                    <div className="mt-6 text-sm">
                        {/* Inputan form */}

                        <form>
                            {
                                allPaymentSummary && allPaymentSummary.map((payment: PaymentSummary) => (
                                    <div className="flex border rounded-md justify-between items-center mt-2" key={payment.id} onClick={() => onOpenCalculator(payment)}>
                                        <p className="text-xs md:text-base font-semibold text-primary ml-4">{capitalizeWords(payment?.name)}</p>
                                        <div className="flex items-center ">
                                            <p className="text-xs md:text-base font-semibold">Rp</p>
                                            <Input className="text-xs md:text-base border-none text-right" defaultValue={formatRupiah(payment?.counted_amount)} value={formatRupiah(payment?.counted_amount)} />
                                        </div>
                                    </div>
                                ))
                            }

                            <div className="p-4 border-2 border-primary rounded-lg bg-blue-100 my-8 text-slate-500">
                                <div className="flex justify-between mb-2">
                                    <p className="text-xs md:text-base">Total Tercatat</p>
                                    <p className="text-primary font-bold text-xs md:text-base">{formatRupiah(totalRecorded as number)}</p>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <p className="text-xs md:text-base">Total Terhitung</p>
                                    <p className="text-primary font-bold text-xs md:text-base">{formatRupiah(totalCounted as number)}</p>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <p className="text-xs md:text-base">Selisih</p>
                                    <p className="text-primary font-bold text-xs md:text-base">{formatRupiah(totalDifferent as number)}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 bg-yellow-100 rounded-md p-4 items-center">
                                <PiWarningCircleFill color="orange" />
                                <p className="text-slate-500 text-sm md:text-base">Pastikan nominal sesuai tanpa ada selisih</p>
                            </div>
                            <div className="flex gap-2 mt-8">
                                <Button className="py-2 px-4 text-xs md:text-base" type="button" onClick={onHandleSubmit} disabled={createSummary.isPending}>
                                    {createSummary.isPending ? 'Memproses...' : 'Rekap Penjualan Sekarang'}
                                </Button>
                                <Button className="py-2 px-4 text-xs md:text-base" variant="secondary" disabled={createSummary.isPending}>
                                    Kembali
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <section className={`border rounded-lg md:w-1/2 xl:w-1/3 md:overflow-y-auto md:sticky md:top-10 md:min-h-[calc(100vh-120px)] md:overflow-x-hidden md:block ${menuMobile === 'detail' ? 'block' : 'hidden'}`}>
                <div className="font-semibold text-lg bg-primary p-4 text-white md:flex md:justify-between md:items-center">
                    <p className="text-sm md:text-base">Detail Rekap</p>
                </div>

                {
                    isPendingSummary
                        ? <p>Loading...</p>
                        : (
                            <div className="p-4">
                                <p className="text-xs md:text-base font-semibold">Rekap Transaksi</p>
                                <div className="grid grid-cols-2 text-xs md:text-base mt-2 text-slate-700">
                                    <p className="text-xs md:text-base">Tanggal</p>
                                    <p className="text-xs md:text-base">: {new Date().toLocaleDateString()}</p>

                                    <p className="text-xs md:text-base">Jumlah transaksi penjualan</p>
                                    <p className="text-xs md:text-base text-primary font-semibold">: {dataSummary?.saleTransactionIds?.length}</p>

                                    <p className="text-xs md:text-base">Jumlah transaksi refund</p>
                                    <p className="text-xs md:text-base text-primary font-semibold">: {dataSummary?.saleRefundIds?.length}</p>
                                </div>

                                <Separator className="my-4" />
                                <p className="text-xs md:text-base font-semibold mb-4">Rekap</p>
                                <ScrollArea className="w-[22rem] md:w-full whitespace-nowrap rounded-md border">
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="p-2 border-b text-xs md:text-base">Nama</th>
                                                <th className="p-2 border-b text-xs md:text-base">Nominal tercatat</th>
                                                <th className="p-2 border-b text-xs md:text-base">Nominal terhitung</th>
                                                <th className="p-2 border-b text-xs md:text-base">Nominal selisih</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-xs md:text-base text-slate-700">
                                            {
                                                summary?.paymentSummaries && summary?.paymentSummaries.map((payment: PaymentSummary) => (
                                                    <tr key={payment.id} >
                                                        <td className="p-2">{capitalizeWords(payment.name)}</td>
                                                        <td className="p-2 border-b">{formatRupiah(payment.recorded_amount as number)}</td>
                                                        <td className="p-2 border-b">{formatRupiah(payment.counted_amount as number)}</td>
                                                        <td className="p-2 border-b">{formatRupiah(payment.difference_amount as number)}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>

                                    <ScrollBar className="w-96 md:w-full " orientation="horizontal" />
                                </ScrollArea>

                                <Separator className="my-4" />
                                <p className="text-xs md:text-base font-semibold">Rekap penjualan</p>
                                <div className="grid grid-cols-2 text-xs md:text-base mt-2 text-slate-700">
                                    <p>Penjualan kotor</p>
                                    <p>: {formatRupiah(dataSummary?.saleSummaries.grossSales as number)}</p>

                                    <p>Promo sebelum pajak</p>
                                    <p>: {formatRupiah(dataSummary?.saleSummaries.promoBeforeTax as number)}</p>

                                    <p>Diskon sebelum pajak</p>
                                    <p>: {formatRupiah(dataSummary?.saleSummaries.discountBeforeTax as number)}</p>

                                    <p>Penjualan</p>
                                    <p>: {formatRupiah(dataSummary?.saleSummaries.netSales as number)}</p>

                                    <p>Pajak</p>
                                    <p>: {formatRupiah(dataSummary?.saleSummaries.taxAmounta as number)}</p>

                                    {/* <p>Harga layanan</p>
                                <p>: {formatRupiah(dataSummary?.saleSummaries.serviceCharge as number)}</p> */}

                                    <p>Biaya layanan</p>
                                    <p>: {formatRupiah(dataSummary?.saleSummaries.paymentPlatformFee as number)}</p>

                                    <p>Penjualan Bersih</p>
                                    <p className="text-primary font-semibold">: {formatRupiah(dataSummary?.saleSummaries.netSalesAfterTax as number)}</p>
                                </div>
                                <Separator className="my-4" />
                                <p className="text-xs md:text-base font-semibold">Rekap refund</p>
                                <div className="grid grid-cols-2 text-xs md:text-base mt-2 text-slate-700">
                                    <p>Refund kotor</p>
                                    <p>: {formatRupiah(dataSummary?.saleRefundSummaries.grossSales as number)}</p>

                                    <p>Promo sebelum pajak</p>
                                    <p>: {formatRupiah(dataSummary?.saleRefundSummaries.promoBeforeTax as number)}</p>

                                    <p>Diskon sebelum pajak</p>
                                    <p>: {formatRupiah(dataSummary?.saleRefundSummaries.discountBeforeTax as number)}</p>

                                    <p>Refund</p>
                                    <p>: {formatRupiah(dataSummary?.saleRefundSummaries.netSales as number)}</p>

                                    <p>Pajak</p>
                                    <p>: {formatRupiah(dataSummary?.saleRefundSummaries.taxAmounta as number)}</p>

                                    {/* <p>Harga layanan</p>
                                <p>: {formatRupiah(dataSummary?.saleRefundSummaries.serviceCharge as number)}</p> */}

                                    <p>Refund Bersih</p>
                                    <p className="text-primary font-semibold">: {formatRupiah(dataSummary?.saleRefundSummaries.netSalesAfterTax as number)}</p>
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
                            onClick={() => setMenuMobile('rekap')}
                        >
                            <p className={`text-xs md:text-base ${menuMobile === 'rekap' && 'text-primary'} flex items-center gap-1`}><AiFillProduct /> Rekap Penjualan</p>
                        </Button>
                        <Button
                            type="button"
                            className="w-1/2"
                            variant="ghost"
                            onClick={() => setMenuMobile('detail')}
                        >
                            <p className={`text-xs md:text-base ${menuMobile === 'detail' && 'text-primary'} flex items-center gap-1`}><TbListDetails /> Detail Rekap</p>
                        </Button>
                    </div>
                </div>
            }

            <CalculatorCash paymentSummary={paymentSummary} isTriggerOpen={isOpen} onClose={onCloseCalculator} />
        </main>
    );
};

export default RekapanPage;
