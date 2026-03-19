"use client";

import { useCheckPromoMutation } from "@/app/api/catalogues/mutation";
import { PaymentMethods } from "@/app/api/payment-method/type";
import OutlinedButton from "@/components/atoms/OutlinedButton";
import { FC } from "react";

interface PaymentMethodProps {
    onOpenCalculator: () => void;
    onSelectPaymentMethod: (method: PaymentMethods, tempOrder: any) => void;
    selected: PaymentMethods | null;
    paymentMethod: PaymentMethods[];
    isPending: boolean;
}
 
const PaymentMethod: FC<PaymentMethodProps> = ({
    onOpenCalculator,
    onSelectPaymentMethod,
    selected,
    paymentMethod,
    isPending
}) => {
    const paymentCash = paymentMethod.filter((method) => method.kind === "cash");
    const paymentDebit = paymentMethod.filter((method) => method.kind=== "debit");
    const paymentCredit = paymentMethod.filter((method) => method.kind === "credit_card");
    const checkPromo = useCheckPromoMutation()

    const onClickPaymentMethod = (method: PaymentMethods, isCash = false) => {
        // call api calculate promo
        const location = localStorage.getItem("location");
        const location_id = JSON.parse(location as string)?.id;

        const order_type_id = localStorage.getItem("selectedOrderTypeId")

        const paymentMethod = {
            payment_method_id: method.id,
        }

        const checkPromoData = JSON.parse(localStorage.getItem("orderWithPromo") as string);
        const payload = {
            ...checkPromoData,
            ...{location_id, order_type_id},
            ...{
                payments: [paymentMethod]
            }
        }

        checkPromo.mutate(payload, {
            onSuccess: (data) => {
                const tempOrder = data.data ?? ""

                selectedPaymentMethod(method, isCash, tempOrder)
            },
            onError: () => {},
        })
    }

    const selectedPaymentMethod = (method: PaymentMethods, isCash = false, tempOrder: any) => {
        onSelectPaymentMethod(method, tempOrder);

        if (isCash) {
            onOpenCalculator();
        }
    }
    
    if(isPending) {
        return (
            <section className="my-4">
                <p className="font-semibold my-2 text-sm md:text-base">Tunai</p>
                <div className="flex jutsify-between gap-2 mt-2 flex-wrap">
                    <div className="w-[100px] h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                    <div className="w-[120px] h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                    <div className="w-[80px] h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                </div>
                <p className="font-semibold my-2 text-sm md:text-base">Debit</p>
                <div className="flex jutsify-between gap-2 mt-2 flex-wrap">
                    <div className="w-[100px] h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                    <div className="w-[50px] h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                    <div className="w-[100px] h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                    <div className="w-[120px] h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                </div>
                <p className="font-semibold my-2 text-sm md:text-base">Credit</p>
                <div className="flex jutsify-between gap-2 mt-2 flex-wrap">
                    <div className="w-[50px] h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                    <div className="w-[50px] h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                    <div className="w-[100px] h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                    <div className="w-[120px] h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                </div>
            </section>
        )
    }

    return ( 
        <section className="my-4">
          <div className="my-4">
            
                { paymentCash.length > 0 && (
                    <>
                        <p className="font-semibold my-2 text-sm md:text-base">Tunai</p>
                        <div className="flex jutsify-between gap-4 flex-wrap">
                            {
                                paymentCash.map((method) => (
                                    <OutlinedButton
                                        key={method.id}
                                        text={method.name}
                                        variant="blue"
                                        onClick={() => onClickPaymentMethod(method, true)}
                                        selected={selected?.id == method?.id}
                                    />
                                ))

                            }
                        </div>
                    </>
                )
                }
          </div>

          <div className="my-4">
            {
                paymentDebit.length > 0 && (
                    <>
                        <p className="font-semibold my-2 text-sm md:text-base">Debit</p>
                        <div className="flex jutsify-between gap-4 flex-wrap">
                            {
                                paymentDebit.map((method) => (
                                    <OutlinedButton
                                        key={method.id}
                                        text={method.name}
                                        variant="blue"
                                        onClick={() => onClickPaymentMethod(method)}
                                        selected={selected?.id == method?.id}
                                    />
                                ))
                            }
                        </div>
                    </>
                )
            }
          </div>

          <div className="my-4">
            {
                paymentCredit.length > 0 && (
                    <>
                        <p className="font-semibold my-2 text-sm md:text-base">Credit</p>
                        <div className="flex jutsify-between gap-4 flex-wrap">
                            {
                                paymentCredit.map((method) => (
                                    <OutlinedButton
                                        key={method.id}
                                        text={method.name}
                                        variant="blue"
                                        onClick={() => onClickPaymentMethod(method)}
                                        selected={selected?.id == method?.id}
                                    />
                                ))
                            }
                        </div>
                    </>
                )
            }
          </div>
        </section>
     );
}
 
export default PaymentMethod;