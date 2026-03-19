"use client"

import { useGetOneSaleTransactionQuery } from "@/app/api/revenue-center/sale-transaction/queries"
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting"
import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { formatRupiah } from "@/lib/utils"
import { FC } from "react"
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl"
import { Separator } from "@/components/ui/separator"
import { SaleTransactionDetail } from "@/types/invoice"
import { SaleTransasctionPayment } from "@/app/api/laporan/report-stock-movement/type"
import { showConfirmationAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert"
import { useVoidSaleTransactionMutation } from "@/app/api/revenue-center/sale-transaction/mutation"

interface DetailSaleTransactionPageProps {
    params: {
        id: string
    }
}

const DetailSaleTransactionPage: FC<DetailSaleTransactionPageProps> = ({
    params
}) => {
    const t = useTranslations()
    const id = params.id;
    const voidSaleTransaction = useVoidSaleTransactionMutation();

    const { data, isPending, refetch } = useGetOneSaleTransactionQuery(id);

    if (isPending) {
        return <SkeletonFormPage />;
    }

    const router = useRouter();
    const onCancel = () => {
        router.push('..')
    };

    const sale = data?.data

    const saleNo = sale.sales_no
    const receiptNo = sale.receipt_no

    const additionalFee = (amount: number, quantity: number, label: string) => {
        if (amount == 0) {
            return <></>
        }

        return (
            <div className="grid grid-cols-4 gap-4 my-2">
                <Label className="text-sm">
                    { label }
                </Label>
                <Label className="text-sm">
                    &nbsp;
                </Label>
                <Label className="text-sm text-right">
                    &nbsp;
                </Label>
                <Label className="text-sm text-right">
                    { formatRupiah(amount * quantity) }
                </Label>
            </div>
        )
    }

    const onVoid = () => {
        if (voidSaleTransaction.isPending) return

        showConfirmationAlert('Batalkan Penjualan', `Apakah ada yakin ingin membatalkan penjualan ${saleNo}?`, 'Iya', 'batal', () => {
            voidSaleTransaction.mutate({id: sale.id, reason: 'pembatalan', notes: 'pembatalan'}, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Membatalkan Penjualan");
                    refetch()
                },
                onError: () => {
                    showToastError("Gagal Membatalkan Penjualan");
                }
            })
        })
    }

    const buildTitle = () => {
        let base = `Sales no: ${saleNo}`
        if (sale.void_at) {
            base += " (Dibatalkan)"
        }

        return base
    }

    return (
        <div>
            <PageTitleSetting title={buildTitle()} subtitle={receiptNo}></PageTitleSetting>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <Label className="text-xs block text-slate-400">
                        Member
                    </Label>
                    <Label className="text-sm">
                        {sale.customer?.first_name} {sale.customer?.last_name}
                    </Label>
                </div>
                <div>
                    <Label className="text-xs block text-slate-400">
                        Lokasi
                    </Label>
                    <Label className="text-sm">
                        {sale.location?.name}
                    </Label>
                </div>
                <div>
                    <Label className="text-xs block text-slate-400">
                        Jenis Pesanan
                    </Label>
                    <Label className="text-sm">
                        {sale.order_type?.name}
                    </Label>
                </div>
            </div>
            <div className="text-center my-4 py-3 px-3 bg-slate-100">
                Detail Pesanan
            </div>
            <div className="grid grid-cols-4 gap-4">
                <Label className="text-sm text-center">
                    Produk
                </Label>
                <Label className="text-sm text-center">
                    Kuantitas
                </Label>
                <Label className="text-sm text-center">
                    Harga
                </Label>
                <Label className="text-sm text-center">
                    Subtotal
                </Label>
            </div>
            {
                sale.sale_transaction_details.map((detail: SaleTransactionDetail) => (
                    <div key={detail.id}>
                        <div className="grid grid-cols-4 gap-4 my-2">
                            <Label className="text-sm">
                                { detail.product_name }
                            </Label>
                            <Label className="text-sm text-right">
                                { detail.quantity }
                            </Label>
                            <Label className="text-sm text-right">
                                { formatRupiah(detail.sell_price, false, false) }
                            </Label>
                            <Label className="text-sm text-right">
                                { formatRupiah(detail.quantity * detail.sell_price, false, false) }
                            </Label>
                        </div>
                        {
                            additionalFee(-detail.discount_amount, detail.quantity, t('adjustment_discount'))
                        }
                        {
                            additionalFee(-detail.promo_amount, detail.quantity, t('adjustment_discount'))
                        }
                        {
                            additionalFee(detail.surcharge_amount, detail.quantity, t('adjustment_surcharge'))
                        }
                    </div>
                ))
            }
            <Separator />
            <div className="grid grid-cols-2 gap-4 my-1">
                <div className="grid grid-cols-2 gap-4"></div>
                <div className="grid grid-cols-2 gap-4">
                    <Label className="text-sm text-right">
                    Subtotal
                    </Label>
                    <Label className="text-sm text-right">
                        { formatRupiah(sale.subtotal, false, false) }
                    </Label>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 my-1">
                <div className="grid grid-cols-2 gap-4"></div>
                <div className="grid grid-cols-2 gap-4">
                    <Label className="text-sm text-right">
                    {t('adjustment_discount')}
                    </Label>
                    <Label className="text-sm text-right">
                        { formatRupiah(-sale.discount_amount, false, false) }
                    </Label>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 my-1">
                <div className="grid grid-cols-2 gap-4"></div>
                <div className="grid grid-cols-2 gap-4">
                    <Label className="text-sm text-right">
                    {t('adjustment_surcharge')}
                    </Label>
                    <Label className="text-sm text-right">
                        { formatRupiah(sale.surcharge_amount, false, false) }
                    </Label>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 my-1">
                <div className="grid grid-cols-2 gap-4"></div>
                <div className="grid grid-cols-2 gap-4">
                    <Label className="text-sm text-right">
                        Total
                    </Label>
                    <Label className="text-sm text-right">
                        { formatRupiah(sale.net_sales_after_tax, false, false) }
                    </Label>
                </div>
            </div>
            {
                sale.sale_transaction_payments.map((payment: SaleTransasctionPayment) => (
                    <div key={payment.id} className="grid grid-cols-4 gap-4">
                        <Label className="text-sm">
                            &nbsp;
                        </Label>
                        <Label className="text-sm">
                            &nbsp;
                        </Label>
                        <Label className="text-sm text-right">
                            { payment.payment_method_name }
                        </Label>
                        <Label className="text-sm text-right">
                            { formatRupiah(payment.amount_receive, false, false) }
                        </Label>
                    </div>
                ))
            }
            <div className='flex gap-4'>
                <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Kembali</Button>

                {
                    sale.void_at == null && <Button className="w-[100px]" onClick={onVoid} variant="destructive" type='button'>Batalkan</Button>
                }
            </div>
        </div>
    )
}

export default DetailSaleTransactionPage;