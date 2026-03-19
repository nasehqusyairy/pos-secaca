"use client";

import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FlexedText from "@/components/atoms/FlexedText";
import { formatRupiah } from "@/lib/utils";
import { useCataloguesStore, useOrderStore } from "@/stores";
import { useCreateSaleMutation } from "@/app/api/catalogues/mutation";
import OrderItem from "@/components/molecules/OrderItem";
import CalculatorCash from "./calculator";
import { useGetPaymentMethodQuery } from "@/app/api/payment-method/queries";
import PaymentMethod from "./metode-pembayaran";
import { Order } from "@/types/order";
import { showConfirmationAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Product, Promo, SaleDataResponse } from "@/types/response/calculate_promo";
import SkeletonKasirPage from "@/components/organisms/Skeleton/SkeletonKasir";
import PreviewStruk from "./preview-struk";
import { PaymentMethods } from "@/app/api/payment-method/type";
import { Adjustment } from "@/app/api/catalogues/type";


interface SummaryPageProps {}

const SummaryPage: FC<SummaryPageProps> = () => {
  
  const orderStore = useOrderStore((state) => state.order) as Order;
  const empSalesId = useOrderStore((state) => state.employee_sales_id) as number;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("")
  const [nominalCash, setNominalCash] = useState<number>(0);
  const [selectPaymentMethod, setSelectPaymentMethod] = useState<PaymentMethods | null>(null);
  const [messageSubmit, setMessageSubmit] = useState<string>("");
  const [order, setOrder] = useState<SaleDataResponse | null>(null)

  // Get data
  const {data: paymentMethods, isPending: isPendingPaymentMethods} = useGetPaymentMethodQuery(100, ['active']);

  const createSalesMutation = useCreateSaleMutation();

  const router = useRouter();

  useEffect(() => {
    const orders = localStorage.getItem("orders");
    if (orders) {
      const orderDetail = JSON.parse(orders);
      
      useOrderStore.setState({ order: orderDetail.order, orderTypeId: orderDetail.orderTypeId, amount: orderDetail.total, customer: orderDetail.customer, employee_sales_id: orderDetail.employee_sales_id });
    }

    const orderWithPromo = localStorage.getItem("orderWithPromo")

    if(orderWithPromo) {
      const orderPromo = JSON.parse(orderWithPromo);
      setOrder(orderPromo)
    }
  }, []);

  useEffect(() => {
      // cetak
      if (url) {
        // setIsOpenPreview(true)
        window.open(url, 'PRINT', "height=400,width=600");
        router.push('katalog');
      }
  }, [url]);

  if(order === null) {
    return <SkeletonKasirPage />
  }

  const onCloseCalcutor = (cashNominal: number) => {
    // Close the calculator
    setIsOpen(false);
    setNominalCash(cashNominal);
  }

  const onOpenCalculator = () => {
    // Open the calculator
    setIsOpen(true);
  }

  const onSelectPaymentMethod = (method: PaymentMethods, tempOrder: any) => {
    setOrder(tempOrder)

    setSelectPaymentMethod(method);
    setNominalCash(0);
  }

  const paymentMethodData = paymentMethods?.data ?? [];

  // detail amount
  // const nominalTotalOrder = amount + (diskon.diskon);
  let nominalChange = nominalCash - (order?.totalAmount ?? 0);

  // Submit pembayaran
  const onSubmitPayment = () => {
    if(createSalesMutation.isPending) return;
    let nominalPayment = nominalCash;

    if (!selectPaymentMethod) {
      setMessageSubmit('Pilih metode pembayaran terlebih dahulu');
      return;
    }

    if (order?.totalAmount === undefined) {
      setMessageSubmit('Jumlah total tidak ada');
      return;
    }

    // Check if cash payment method is selected and the nominal is enough to pay the order
    if (selectPaymentMethod.kind === 'cash') {
      if (nominalCash < order?.totalAmount) {
        setMessageSubmit('Uang tunai tidak cukup');
        return;
      }
    } else {
      nominalChange = 0;
      nominalPayment = order?.totalAmount;
    }

    const paymentMethod = {
      payment_method_id: selectPaymentMethod.id,
      amount_receive: nominalPayment,
      change: nominalChange
    }

    // Create order
    const orderPayload = {
      ...order,
      location_id: orderStore.location_id,
      order_type_id: orderStore.order_type_id,
      employee_sales_id: empSalesId, 
      products: order.products.map((product: any) => {
          if (!product.adjustment) {
            delete product.adjustment;
          }

          return product;
      }),
      payments: [
        paymentMethod
      ]
    } as any; // cannot implement type

    if (!orderPayload.customer) {
      delete orderPayload.customer
    }

    // cek has customer or not
    if(order.customer){
      orderPayload["customer"] = order.customer
    }

    showConfirmationAlert('Apakah order sudah sesuai?', '', 'Iya', 'batal', () => {
      // setIsOpenPreview(true)
      createSalesMutation.mutate(orderPayload, {
        onSuccess: (data) => {
          const pdfUrl = process.env.NEXT_PUBLIC_API_URL + `/api/sale_transactions/${data.data.id}/pdf`
          setUrl(pdfUrl)
          
          showToastSuccess("Berhasil Membuat Pesanan");
          localStorage.removeItem("orders");
          localStorage.removeItem("selected");
          localStorage.removeItem("orderWithPromo");
          // clear store
          useOrderStore.setState({ order: undefined, orderTypeId: 0, amount: 0, employee_sales_id: 0 });
          useCataloguesStore.setState({ products: [] });
        },
        onError: () => {
            showToastError("Gagal Membuat Pesanan");
        }
      });
    })
  }

  const onClickPrevious = () => {
    router.push('katalog');
  }

  const buildAdjustment = (adjustment?: Adjustment) => {
    if (!adjustment || adjustment.amount == 0) {
      return <></>
    }

    const label = adjustment.amount < 0 ? 'Diskon' : 'Biaya Penambahan'
    const addLabel = adjustment.is_percentage ? '(' +adjustment.amount + '%)' : ''
    const totalAmount = adjustment.amount < 0 ? adjustment.discountAmount * -1 : adjustment.surchargeAmount

    return (
      <FlexedText
        leftText={label + addLabel}
        rightText={`${formatRupiah(totalAmount)}`}
      />
    )
  }

  const buildFee = (paymentPlatformFee?: number) => {
    if (!paymentPlatformFee) {
      return <></>
    }

    if (paymentPlatformFee <= 0) {
      return <></>
    }

    const fee = paymentPlatformFee;

    return (
      <FlexedText
        leftText='Biaya'
        rightText={`${formatRupiah(fee)}`}
      />
    )
  }

  const nameCustomer = order?.customer ? `${order.customer?.first_name} ${order.customer?.last_name}` : '-'

  return (
    <main className="w-auto md:flex md:justify-center md:gap-10 md:pb-20 bg-primary md:bg-white">
      <section className="w-full mb-10 p-4 md:p-0 md:m-0 md:w-1/2 pt-3 md:relative bg-white">
        <div className="flex gap-2 cursor-pointer items-center mb-4" onClick={onClickPrevious}>
          <IoMdArrowRoundBack color="blue"/>
          <p className="text-primary text-xs md:text-base">Kembali ke katalog</p>
        </div>
        <div className="flex justify-between">
          <div className="w-full">
            <p className="font-bold text-base md:text-[20px] mb-2">Order ID #{Math.floor(Math.random() * 10000) + 1}</p>
            <FlexedText leftText={nameCustomer} rightText="Belanja di Toko" />
          </div>
        </div>

        <Separator className="my-4" />

        {order?.products?.map((val: Product, idx) => {
          return (
            <OrderItem
              qty={val?.quantity as number}
              productName={val?.product?.name}
              price={formatRupiah(val.sell_price)}
              adjustment={val.adjustment}
              index={idx}
              key={idx}
            />
          );
        })}

        <Separator className="my-4" />

        <div className="flex flex-col gap-2">
          <FlexedText leftText="Subtotal" rightText={formatRupiah(order?.subTotal)} />
          {
            order.adjustment && buildAdjustment(order.adjustment)
          }
          {
            order.promos.length > 0 && (
              order.promos.map((promo: Promo) => (
                <FlexedText
                  leftText={promo.promoName}
                  key={promo.promoId}
                  rightText={formatRupiah(promo.appliedPromoAmount)}
                />
              ))
            )
          }
          {
            buildFee(order.paymentPlatformFee)
          }

          <div className="flex justify-between md:mt-2">
            <p className="text-slate-500 font-semibold text-sm md:text-base">Grand Total</p>
            <p className="text-slate-500 font-bold text-base md:text-lg">
              {formatRupiah(order.totalAmount)}
            </p>
          </div>
        </div>

        <div> </div>
      </section>

      <section className="border m-4 p-2 rounded-lg md:m-0 md:w-1/2 xl:w-1/3 md:p-3 md:pb-20 shadow-md md:overflow-y-auto md:sticky md:top-10 min-h-[calc(70vh)] md:min-h-[calc(100vh-120px)] md:overflow-x-hidden bg-slate-50">
        <p className="font-semibold my-4 text-base md:text-[20px]">Detail Pembayaran</p>
        <div className="w-full p-3 bg-white rounded-lg min-h-[140px]">
          {
            (selectPaymentMethod?.kind === 'cash') ? (
              <div>
                <div className="flex justify-between mt-2">
                  <p className="text-slate-500 text-sm md:text-base">Uang Tunai</p>
                  <p className="text-slate-500 font-medium text-base md:text-lg">
                    {formatRupiah(nominalCash)}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-slate-500 text-sm md:text-base">Total Pesanan</p>
                  <p className="text-slate-500 font-medium text-base md:text-lg">
                  {formatRupiah(order.totalAmount)}
                  </p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-slate-500 text-sm md:text-base">Kembalian</p>
                <p className="text-primary font-bold text-base md:text-lg">
                  {formatRupiah(nominalChange)}
                </p>
              </div>
              </div>
            ) : (
              <div className="flex justify-between mt-2">
                <p className="text-slate-500 text-sm md:text-base">Total Pesanan</p>
                <p className="text-primary font-bold text-base md:text-lg">
                  {formatRupiah(order.totalAmount)}
                </p>
              </div>
            )
          }
        </div>

        <p className="font-semibold my-4 text-base md:text-[20px]">Metode Pembayaran</p>

        <PaymentMethod onOpenCalculator={onOpenCalculator} onSelectPaymentMethod={onSelectPaymentMethod} selected={selectPaymentMethod} paymentMethod={paymentMethodData} isPending={isPendingPaymentMethods}/>

        <section className="mt-20 md:mt-0 md:w-11/12 md:absolute md:bottom-4">
          <div className="w-full flex justify-center">
            <Button
              type="submit"
              className="w-full"
              onClick={() => onSubmitPayment()}
            >
              <p className="font-semibold text-xs md:text-base">{createSalesMutation.isPending ? 'Processing...' : 'Konfirmasi Pembayaran'}</p>
            </Button>
          </div>
          {messageSubmit && <p className="text-red-600 mt-2">*{messageSubmit}</p>}
        </section>
      </section>

      <CalculatorCash total={order.totalAmount} isTriggerOpen={isOpen} onClose={onCloseCalcutor} />
      {/* <PreviewStruk isTriggerOpen={isOpenPreview} url={url} urlRedirect={'katalog'}/>  */}
      {/* TODO: GANTI url */}
    </main>
  );
};

export default SummaryPage;
