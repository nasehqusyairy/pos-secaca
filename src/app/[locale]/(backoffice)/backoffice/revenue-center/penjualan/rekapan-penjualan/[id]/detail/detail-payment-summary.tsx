"use client"

import { TakingPaymenDetails } from "@/app/api/revenue-center/taking/type";
import { formatRupiah } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface DailySaleDetailPaymentSummaryProps {
    details?: TakingPaymenDetails[],
}

const DailySaleDetailPaymentSummary: FC<DailySaleDetailPaymentSummaryProps> = (params) => {
    const t = useTranslations();

    const details = params.details
    if (!details || details.length == 0) {
        return (
            <></>
        )
    }

    let counted_amount_total = 0;
    let recorded_amount_total = 0;
    let difference_amount_total = 0;
    let sales_amount_total = 0;
    details.forEach((detail: TakingPaymenDetails) => {
        counted_amount_total += detail.counted_amount
        recorded_amount_total += detail.recorded_amount
        difference_amount_total += detail.difference_amount
        sales_amount_total += detail.sales_amount
    })

    return (
        <div className="my-4">
            <Separator className="my-2" />
            <div className="bold my-2 font-bold">
                {t('summary')}
            </div>
            <div className="grid grid-cols-5 gap-2">
                <label className="p-1">
                    {t('payment_method_name')}
                </label>
                <label className="text-center p-1">
                    {t('counted')}
                </label>
                <label className="text-center p-1">
                    {t('recorded')}
                </label>
                <label className="text-center p-1">
                    {t('difference')}
                </label>
                <label className="text-center p-1">
                    {t('sales_summary')}
                </label>
            </div>
            {
                details.map((detail: TakingPaymenDetails) => (
                    <div key={detail.id} className="grid grid-cols-5 gap-2">
                        <label className="p-1">
                            {detail.payment_method.name}
                        </label>
                        <label className="text-right p-1">
                            {formatRupiah(detail.counted_amount, false, false)}
                        </label>
                        <label className="text-right p-1">
                            {formatRupiah(detail.recorded_amount, false, false)}
                        </label>
                        <label className="text-right p-1">
                            {formatRupiah(detail.difference_amount, false, false)}
                        </label>
                        <label className="text-right p-1">
                            {formatRupiah(detail.sales_amount, false, false)}
                        </label>
                    </div>
                ))
            }
            <div className="grid grid-cols-5 gap-2">
                <label className="p-1 font-bold">
                    {t('total')}
                </label>
                <label className="text-right p-1 font-bold">
                    {formatRupiah(counted_amount_total, false, false)}
                </label>
                <label className="text-right p-1 font-bold">
                    {formatRupiah(recorded_amount_total, false, false)}
                </label>
                <label className="text-right p-1 font-bold">
                    {formatRupiah(difference_amount_total, false, false)}
                </label>
                <label className="text-right p-1 font-bold">
                    {formatRupiah(sales_amount_total, false, false)}
                </label>
            </div>
        </div>
    )
}

export default DailySaleDetailPaymentSummary;