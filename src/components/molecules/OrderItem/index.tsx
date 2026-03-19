import React, { FC } from "react";
import { formatRupiah } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Adjustment } from "@/app/api/catalogues/type";

interface OrderItemProps {
  qty: number;
  productName: string;
  price: string;
  index: number;
  adjustment: Adjustment,
}

const OrderItem: FC<OrderItemProps> = ({ qty, productName, price, index, adjustment }) => {
  const t = useTranslations()

  const labelAdjusment = () => {
    if (!adjustment || adjustment?.amount == 0) {
      return (<></>)
    }

    let label = adjustment.amount < 0 ? t('adjustment_discount') : t('adjustment_surcharge')
    if (adjustment.is_percentage) {
      label += ` (${adjustment.amount}%)`
    }

    return <p>{label}</p>
  }

  return (
    <div
        className={`items-center p-5 rounded-lg ${
          index % 2 == 0 && "bg-slate-100"
        }`}
      >
        <div className="flex justify-between">
          <div className="flex gap-2 text-sm md:text-base">
            <p className="font-bold">{qty} x</p>
            <p>{productName}</p>
          </div>
          <div>
            <p className="text-sm font-semibold md:text-base">{price}</p>
          </div>
        </div>
        {
            !adjustment ? <></> : <div className="flex justify-between pt-3">
                <div className="flex gap-2">
                  {/* <p className="font-bold">{qty} x</p> */}
                  <p className="text-sm md:text-base">{ labelAdjusment() }</p>
                </div>

                <div>
                  <p className="text-sm md:text-base">{ adjustment.amount < 0 ? formatRupiah(adjustment.discountAmount * -1) : formatRupiah(adjustment.surchargeAmount)}</p>
                </div>
              </div>
          }
      </div>
  );
};

export default OrderItem;
