"use client"

import { useGetInvoiceDetailQuery } from "@/app/api/invoice/query";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { InvoiceModel, SaleTransactionDetail } from "@/types/invoice";
import { FC, useEffect, useState } from "react";
import ProdukOrder from "./order-product";
import RefundItem from "./refund-product";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CalculatorCash from "../../pembayaran/calculator";
import { useRouter } from "next/navigation";
import { showConfirmationAlert, showToastSuccess } from "@/components/templates/SweetAlert";
import { useCreateRefundMutation } from "@/app/api/invoice/mutation";
import SkeletonKasirPage from "@/components/organisms/Skeleton/SkeletonKasir";
import { Customer } from "@/types/order";
import { PaymentMethods } from "@/app/api/payment-method/type";
import SaleTransactionDropdownSelectWithoutLoadMore from "@/components/templates/Dropdowns/sale-transaction-dropdown-without-load-more";


interface RefundPageProps {
    params: {
        id: number
    }
}
 
const RefundPage: FC<RefundPageProps> = ({
    params
}) => {
    const [products, setProducts] = useState<SaleTransactionDetail[]>([])
    const [refundProducts, setRefundProducts] = useState<SaleTransactionDetail[]>([])
    const [refundProductAmount, setRefundProductAmount] = useState<number>(0)
    const [transaction, setTransaction] = useState<InvoiceModel>();
    const [isOpen, setIsOpen] = useState<boolean>(false);    const [nominalCash, setNominalCash] = useState<number>(0);
    const [selectPaymentMethod, setSelectPaymentMethod] = useState<PaymentMethods | null>(null);
    const [error, setError] = useState<string>('');
    const [locId, setLocId] = useState<number>(0);
    const [formValue, setFormValue] = useState<any>({
        reason: '',
        notes: '',
        sale_transaction_details: [],
        payments: []
    })

    const id = params.id ?? 0;

    // Get data
    const {data: dataInvoiceDetail, isPending: isPendingInvoice} = useGetInvoiceDetailQuery(id)
    const createRefund = useCreateRefundMutation();
    
    // router
    const router = useRouter();

    // Form
    useEffect(() => {
        if(dataInvoiceDetail) {
            setProducts([...dataInvoiceDetail.sale_transaction_details])
        }
    }, [dataInvoiceDetail])

    useEffect(() => {
        if (!refundProducts) return

        setRefundProductAmount(refundProducts.reduce((acc, product) => acc + calculateLine(product), 0))
    }, [refundProducts])

    useEffect(() => {
        const location = JSON.parse(localStorage.getItem("location") as string);
        if(location) {
          setLocId(location.id)
        }
      }, [])

    const onHandleRefund = (id: number) => {
        // add to refund
        addProductToRefund(id);

        // minus quantity product
        minProductAfterRefund(id);
    }

    const onHandleBackRefund = (id: number) => {
        // minus quantity refund
        minRefundAfterProduct(id);

        // add to product
        addRefundToProduct(id);
    }

    const handleReset = () => {
        if (refundProducts.length === 0) return;
    
        // Gabungkan produk dengan yang ada di refundProducts
        const mergedProducts = [...products];
    
        refundProducts.forEach((refundProducts) => {
            const existingRefundProduct = mergedProducts.find(
                (p) => p.id === refundProducts.id
            );
    
            if (existingRefundProduct) {
                existingRefundProduct.quantity += refundProducts.quantity;
            } else {
                mergedProducts.push({ ...refundProducts });
            }
        });
    
        // Update state
        setRefundProducts([]);
        setProducts(mergedProducts);
    };
    

    const handleRefundAll = () => {
        if (products.length === 0) return;
    
        // Jika refundProducts kosong, pindahkan semua produk
        if (refundProducts.length === 0) {
            setRefundProducts(products);
            setProducts([]);
            return;
        }
    
        // Gabungkan produk dengan yang ada di refundProducts
        const mergedRefundProducts = [...refundProducts];
    
        products.forEach((product) => {
            const existingRefundProduct = mergedRefundProducts.find(
                (p) => p.id === product.id
            );
    
            if (existingRefundProduct) {
                existingRefundProduct.quantity += product.quantity;
            } else {
                mergedRefundProducts.push({ ...product });
            }
        });
    
        // Update state
        setRefundProducts(mergedRefundProducts);
        setProducts([]);
    };
    

    const addProductToRefund = (id: number) => {
        const refundProduct = refundProducts.find((product) => product.id === id);
    
        if (refundProduct) {
            setRefundProducts((prev) =>
                prev.map((product) =>
                    product.id === id
                        ? { ...product, quantity: product.quantity + 1 }
                        : product
                )
            );
            return;
        }
    
        const product = products.find((product) => product.id === id);
        if (!product) return;
    
        const newProduct = { ...product, quantity: 1 };
        setRefundProducts((prev) => [...prev, newProduct]);
    };

    const minProductAfterRefund = (id: number) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === id
                    ? { ...product, quantity: Math.max(product.quantity - 1, 0) }
                    : product
            ).filter((product) => product.quantity - product.cancelled_quantity > 0)
        );
    };

    const addRefundToProduct = (id: number) => {
        const product = products.find((product) => product.id === id);
    
        if (product) {
            setProducts((prev) =>
                prev.map((product) =>
                    product.id === id ? { ...product, quantity: product.quantity + 1 } : product
                )
            );
            return;
        }
    
        const tempProduct = refundProducts.find((p) => p.id === id);
        if (!tempProduct) return;
    
        const newProduct = { ...tempProduct, quantity: 1 };
        setProducts((prev) => [...prev, newProduct]);
    };
    

    const minRefundAfterProduct = (id: number) => {
        setRefundProducts((prev) =>
            prev
                .map((product) =>
                    product.id === id
                        ? { ...product, quantity: Math.max(product.quantity - 1, 0) }
                        : product
                )
                .filter((product) => product.quantity > 0)
        );
    };

    const handleChangeForm = (e: any) => {
        setFormValue({
            ...formValue,
            [e.target.name]: e.target.value
        })
    }

    const onCloseCalcutor = (cashNominal: number) => {
        // Close the calculator
        setIsOpen(false);
        setNominalCash(cashNominal);
    }
    
    const onHandleSubmit = () => {
        if(createRefund.isPending) return;

        setError('');

        // all must be filled
        if (refundProducts.length === 0) {
            setError('Pilih produk yang akan di refund');
            return;
        }

        // if (!selectPaymentMethod) {
        //     setError('Pilih metode pembayaran');
        //     return;
        // }

        if(formValue.reason === '') {
            setError('Alasan refund harus diisi');
            return;
        }

        if(formValue.notes === '') {
            setError('Catatan refund harus diisi');
            return;
        }

        if(transaction?.id == null) {
            setError('Transaksi harus diisi');
            return;
        }

        // check if cash payment method is selected and the nominal is enough to pay the order
        // if (selectPaymentMethod.kind === 'cash') {
        //     if (nominal < amount) {
        //         setError('Uang cash tidak mencukupi');
        //         return;
        //     }
        // } else {
        //     nominal = amount;
        //     tempNominalChange = 0;
        // }

        // create payload
        const payload = {
            ...formValue,
            saleReferenceId: transaction?.id,
            sale_transaction_details: refundProducts.map(data => {
                return {
                    id: data.id,
                    quantity: data.quantity
                }
            }),
            payments: [
                {
                    // payment_method_id: selectPaymentMethod.id,
                    payment_method_id: 0,
                    amount_receive: 0,
                    change: 0
                }
            ]
        }

        // do refund
        showConfirmationAlert('Apakah anda yakin ingin melakukan refund?', '', 'Iya', 'batal', () => {
            createRefund.mutate({id, data: payload}, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Membuat Refund");
                    router.push('../invoice')
                },
                onError: (error) => {
                    console.error('Failed to create refund', error);
                }
            })
        })
        // router.push('../invoice')
    }

    const memberLabel = (member?: Customer) => {
      if (!member) {
        return '-'
      }
  
      return member.first_name + ' ' + member.last_name
    }

    const calculateLine = (saleDetail: SaleTransactionDetail) => {
        return (
            (saleDetail.quantity * saleDetail.sell_price) - 
            (saleDetail.prorate_discount_amount * saleDetail.quantity) - 
            (saleDetail.prorate_promo_amount * saleDetail.quantity) +
            (saleDetail.prorate_surcharge_amount * saleDetail.quantity)
        )
    }

    const calculateTotalDiscount = (saleDetail: SaleTransactionDetail) => {
        return (saleDetail.prorate_discount_amount * saleDetail.quantity) +
        (saleDetail.prorate_promo_amount * saleDetail.quantity)
    }

    if (isPendingInvoice) {
        return <SkeletonKasirPage />
    }

    // detail amount
    const amount = refundProducts.reduce((acc, product) => acc + calculateLine(product), 0);
    const discount = refundProducts.reduce((acc, product) => acc + calculateTotalDiscount(product), 0);
    const nominalChange = nominalCash - amount;

    return ( 
    <main className="p-4 md:px-10 mb-20">
        <div className="flex justify-between items-center gap-4">
            <div>
                <p className="text-lg md:text-2xl font-semibold">Pengembalian dana</p>
                <p className="text-xs md:text-sm text-slate-400">Silahkan lakukan pengembalian dana {dataInvoiceDetail.sales_no} disini</p>
            </div>
            <Button variant='secondary' className="text-xs md:text-base" onClick={() => router.push('../invoice')}>Kembali</Button>
        </div>

        <div className="w-full h-1 bg-primary rounded-full my-4"></div>
        <p className="text-base md:text-lg font-semibold">Daftar Produk</p>
        <p className="text-xs md:text-sm text-slate-400">Daftar produk yang diajukan untuk pengembalian, mencakup nama produk, jumlah, alasan refund, status permohonan, dan opsi pengembalian atau penukaran </p>

        <div className="flex gap-2 mt-6">
            <Button type="button" onClick={handleRefundAll}>
                <p className="font-semibold text-xs md:text-base">Refund semua</p>
            </Button>
            <Button type="button" onClick={handleReset} className="bg-gray-400 hover:bg-gray-500">
                <p className="font-semibold text-xs md:text-base">Reset</p>
            </Button>
        </div>

        <div className="md:grid md:grid-cols-2 gap-4 my-8">
            <div className="w-full text-xs md:text-base">
                <Label>Daftar produk</Label>
                {
                    products.length > 0 ? products?.map((product: SaleTransactionDetail, index: number) => (
                        <ProdukOrder product={product} handleRefund={onHandleRefund} key={index}/>
                    )) : (
                        <p className="text-slate-500 mt-2 text-xs md:text-sm">Tidak ada produk</p>
                    )
                }
                <div className="mt-4">
                    <Label>Alasan Refund</Label>
                    <Textarea placeholder="Tuliskan alasan refund." className="text-xs md:text-sm mt-2" name="reason" onChange={handleChangeForm}/>
                </div>

                <div className="mt-4">
                    <Label>Catatan</Label>
                    <Textarea placeholder="Tuliskan catatan refund." className="text-xs md:text-sm mt-2" name="notes" onChange={handleChangeForm}/>
                </div>
                
                <div className="mt-4 flex flex-col gap-1">
                    <Label className="mb-2">Transaksi Pengganti</Label>
                    <SaleTransactionDropdownSelectWithoutLoadMore 
                        excludeSaleIds={[id]}
                        locationIds={[locId]}
                        refundProductAmount={refundProductAmount}
                        handleValueChange={setTransaction}
                        full
                    />
                </div>

                {/* <div className="mt-4">
                    <Label>Metode Pembayaran</Label>
                    <PaymentMethod onOpenCalculator={onOpenCalculator} onSelectPaymentMethod={onSelectPaymentMethod} selected={selectPaymentMethod} paymentMethod={paymentMethodData} isPending={isPendingPaymentMethods}/>
                </div> */}
            </div>
            <div className="mt-8 mb:mt-0 mb-4 border-2 border-primary p-4 shadow-xl rounded-lg bg-white flex flex-col justify-between text-sm">
                <div className="mb-8">
                    <Label className="font-semibold">Produk yang akan di refund</Label>
                    {
                        refundProducts.length > 0 ? refundProducts?.map((product: SaleTransactionDetail) => (
                            <RefundItem key={product.id} product={product} handleRefund={onHandleRefund} handleBackProduct={onHandleBackRefund} products={products}/>
                        )) : (
                            <p className="text-slate-500 mt-2">Tidak ada produk yang akan di refund</p>
                        )
                    }
                </div>
                <div>
                    <Label>Ringkasan Refund</Label>
                    {
                        (selectPaymentMethod?.kind === 'cash') ? (
                            <div className="text-xs md:text-sm">
                                <div className="flex justify-between mt-2">
                                    <p className="text-slate-500">Uang Cash</p>
                                    <p className="text-slate-500 font-medium">
                                    {formatRupiah(nominalCash)}
                                    </p>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <p className="text-slate-500">Total Refund</p>
                                    <p className="text-slate-500 font-medium">
                                    {formatRupiah(amount)}
                                    </p>
                                </div>
                                <div className="flex justify-between mt-2">
                                <p className="text-slate-500">Kembalian</p>
                                <p className="text-primary font-bold">
                                    {formatRupiah(nominalChange)}
                                </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                { discount > 0 && <div className="flex justify-between mt-2 text-sm md:text-base">
                                    <p className="text-slate-500">Diskon</p>
                                    <p className="text-slate-500 font-medium">
                                    {formatRupiah(discount)}
                                    </p>
                                </div>}
                                <div className="flex justify-between mt-2 text-sm md:text-base">
                                    <p className="text-slate-500">Total Refund</p>
                                    <p className="text-primary font-bold">
                                        {formatRupiah(amount)}
                                    </p>
                                </div>
                            </>
                        )
                    }
                    <Button className="mt-8 w-full text-xs md:text-base" onClick={onHandleSubmit}>{createRefund.isPending ? 'Memproses refund ...' : 'Proses refund'}</Button>
                    {error && <p className="text-red-600 text-xs md:text-sm mt-2">* {error}</p>}
                </div>
            </div>
        </div>
            
        <CalculatorCash total={amount} isTriggerOpen={isOpen} onClose={onCloseCalcutor} />
      </main>
     );
}
 
export default RefundPage;