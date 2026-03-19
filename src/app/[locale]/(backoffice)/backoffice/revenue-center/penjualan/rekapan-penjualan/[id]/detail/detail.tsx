"use client"

import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { FC } from "react";
import DailySaleDetailPaymentSummary from "./detail-payment-summary";
import { formatDate, formatRupiah, formatterWithTime } from "@/lib/utils";
import { Taking } from "@/app/api/revenue-center/taking/type";

interface DailySaleDetailProps {
    taking: Taking,
}

const DailySaleDetail: FC<DailySaleDetailProps> = (params) => {
    const t = useTranslations();

    const taking = params.taking
    const local_taking_at = new Date(taking.local_taking_at)

    return (
        <div className="p-1">
            <div className="grid grid-cols-3 gap-4 mb-2">
                <div>
                    <div className="font-bold">
                        { t('taking_date') }
                    </div>
                    <div>
                        { formatDate(local_taking_at, formatterWithTime) }
                    </div>
                </div>
                <div>
                    <div className="font-bold">
                        { t('location_name') }
                    </div>
                    <div>
                        { taking.location?.name ?? '-' }
                    </div>
                </div>
                <div>
                    <div className="font-bold">
                        Nama Kasir
                    </div>
                    <div>
                        { taking.employee_first_name ?? '-' } { taking.employee_last_name ?? '-' }
                    </div>
                </div>
            </div>
            <DailySaleDetailPaymentSummary details={taking.taking_payment_details}/>
            <div>
                <Separator className="my-2" />
                <div className="my-2 font-bold">
                    { t('sales_summary')}
                </div>
                <div className="grid grid-cols-2 gap-2 my-2">
                    <div>
                        { t('sales_count') }
                    </div>
                    <div className="text-right">
                        { taking.sales_count }
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 my-2">
                    <div>
                        { t('refund_count') }
                    </div>
                    <div className="text-right">
                        { taking.refund_count }
                    </div>
                </div>
                <Separator className="my-2" />
                <div className="my-2 font-bold">
                    { t('type')}
                </div>
                <div className="grid grid-cols-2 gap-2 my-2">
                    <div>
                        { t('gross_sales') }
                    </div>
                    <div className="text-right">
                        { formatRupiah(taking.gross_sales, false, false) }
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 my-2">
                    <div>
                        { t('gross_refund') }
                    </div>
                    <div className="text-right">
                        { formatRupiah(taking.gross_refund,false,false) }
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 my-2">
                    <div>
                        { t('discount_amount') }
                    </div>
                    <div className="text-right">
                        { formatRupiah((taking.discount_amount - taking.discount_amount_refund) + (taking.promo_amount - taking.promo_amount_refund),false,false) }
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 my-2">
                    <div>
                        { t('surcharge_amount') }
                    </div>
                    <div className="text-right">
                        { formatRupiah(taking.surcharge_amount - taking.surcharge_amount_refund,false,false) }
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 my-2">
                    <div className="font-bold">
                        { t('net_sales') }
                    </div>
                    <div className="text-right">
                        { formatRupiah(taking.net_sales - taking.net_sales_refund,false,false) }
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 my-2">
                    <div>
                        { t('tax_amount') }
                    </div>
                    <div className="text-right">
                        { formatRupiah(taking.tax_amount - taking.tax_amount_refund,false,false) }
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 my-2">
                    <div className="font-bold">
                        { t('net_sales_after_tax') }
                    </div>
                    <div className="text-right">
                        { formatRupiah(taking.net_sales_after_tax - taking.net_sales_after_tax_refund,false,false) }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DailySaleDetail;