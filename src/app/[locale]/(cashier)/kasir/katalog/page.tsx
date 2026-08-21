"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosSearch, IoMdCart } from "react-icons/io";
import CashierDisplay from "@/components/organisms/CashierProducts";
import { Separator } from "@/components/ui/separator";
import ProductQuantity from "@/components/molecules/ProductQuantity";
import { CiDiscount1 } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import FlexedText from "@/components/atoms/FlexedText";
import { useGetCatalogueQueryWithCursor } from "@/app/api/catalogues/query";
import { formatRupiah, getProductPrice, getProductStock } from "@/lib/utils";
import { useCataloguesStore, useOrderStore } from "@/stores";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCheckPromoMutation } from "@/app/api/catalogues/mutation";
import { Customer, Kasir, Order, Products } from "@/types/order";
import CustomerPage from "./customer";
import { showConfirmationDeletePermanentAlert, showToastSuccess } from "@/components/templates/SweetAlert";
import Discount from "./discount";
import { Promo, Product, SaleDataResponse } from "@/types/response/calculate_promo";
import LoadingPage from "@/components/templates/LoadingPage";
import HeaderSummery from "./header";
import EnployeePopup from "./employee";
import { Adjustment, Catalogues } from "@/app/api/catalogues/type";
import { OrderTypes } from "@/app/api/order-type/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiFillProduct } from "react-icons/ai";
import { Badge } from "@/components/ui/badge";
import OpenOrderPage from "./open-order";
import { CustomerOrder } from "@/app/api/customer_order/type";

interface KeranjangPageProps {}

const KeranjangPage: FC<KeranjangPageProps> = () => {

  const [keyWord, setKeyword] = useState<string>("");
  const [cursor, setCursor] = useState<string | undefined | null>(undefined);
  const [selected, setSelected] = useState<Catalogues[]>([]);
  const [orderType, setOrderType] = useState<OrderTypes>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalItem, setTotalItem] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [id, setId] = useState<number>(0);

  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [kasir, setKasir] = useState<Kasir | null>(null)

  const [openPelanggan, setOpenPelanggan] = useState<boolean>(false);
  const [openDiskon, setOpenDiskon] = useState<boolean>(false);
  const [openKasir, setOpenKasir] = useState<boolean>(false);
  const [openOrder, setOpenOrder] = useState<boolean>(false);
  const [loadingDiskon, setLoadingDiskon] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [order, setOrder] = useState<SaleDataResponse | null>(null)
  const [productDiskon, setProductDiskon] = useState<Catalogues | null>(null)
  const inputSearch = useRef<HTMLInputElement>(null);
  const [flagAutoAssignProduct, setFlagAutoAssignProduct] = useState<boolean>(false);
  const [menuMobile, setMenuMobile] = useState<string>("produk");
  const [customerOrderId, setCustomerOrderId] = useState<number | undefined>(undefined);

  const { data: dataCatalogue, isPending, refetch } = useGetCatalogueQueryWithCursor(id, keyWord, cursor, true);

  const checkPromo = useCheckPromoMutation()

  const router = useRouter();
  const locale = useLocale();

  const data = dataCatalogue?.data ?? []
  const nextCursor = dataCatalogue?.nextCursor
  const prevCursor = dataCatalogue?.prevCursor

  useEffect(() => {
    const loc_id = localStorage.getItem("location");
    const id = JSON.parse(loc_id as string)?.id;

    // set selected
    const selected = localStorage.getItem("selected");
    if (selected) {
      setSelected(JSON.parse(selected));
      submitProducts(JSON.parse(selected));
    }
    setId(id);

    // have Order
    const orders = localStorage.getItem("orders")
    if(orders){
      const tempOrder = JSON.parse(orders);
      
      setCustomer(tempOrder?.customer)
    }

    const orderWithPromo = localStorage.getItem("orderWithPromo")
    if(orderWithPromo){
      const data = JSON.parse(orderWithPromo)

      setOrder(data)
      setCustomer(data.customer)
      setCustomerOrderId(data.customerOrderId)
    }
  }, []);
  
  useEffect(() => {
    setSubTotal(sumQuantityAndPrice(selected) as number);

    // Save to local storage
    localStorage.setItem("selected", JSON.stringify(selected));
    if (selected.length === 0) {
      localStorage.removeItem("selected");
    }

    if (orderType && orderType != null) {
      localStorage.setItem("selectedOrderTypeId", String(orderType.id));
      localStorage.setItem("selectedOrderType", JSON.stringify(orderType));
    }
  }, [selected, orderType]);

  useEffect(() => {
    if (subTotal > 0) {
      setTotalAmount(subTotal - (order?.adjustment?.discountAmount ?? 0) + (order?.adjustment?.surchargeAmount ?? 0))
    } else {
      setTotalAmount(0)
    }

    // TODO Only call on submit
    if (orderType) {
      setMappingSubmit(false, order?.adjustment?.amount ?? 0, order?.adjustment?.is_percentage ?? false ? '%' : '')
    }
  }, [subTotal])

  useEffect(() => {
    if (flagAutoAssignProduct && data.length == 1) {
      handleToggleProduct(data[0])
      setFlagAutoAssignProduct(false)
      setKeyword('')
      if (inputSearch && inputSearch.current) {
        inputSearch.current.value = ''
      }
    }
  }, [data, flagAutoAssignProduct])

  useEffect(() => {
    refetch()
  }, [cursor])

  useEffect(() => {
    handleRefreshCatalogue()
  }, [keyWord])

  useEffect(() => {
    setMappingSubmit(false, order?.adjustment?.amount ?? 0, order?.adjustment?.is_percentage ?? false ? '%' : '')
  }, [customer])

  const handlePrevCatalogue = () => {
    if (prevCursor == null) {
      return
    }

    setCursor(prevCursor)
  }

  const handleNextCatalogue = () => {
    if (nextCursor == null) {
      return
    }

    setCursor(nextCursor)
  }

  const handleRefreshCatalogue = () => {
    if (cursor) {
      setCursor(undefined)
    } else if (id > 0) {
      refetch()
    }
  }

  const handleRefetch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleRefreshCatalogue()
  };

  const sumQuantityAndPrice = (products: Catalogues[]) => {
    if (!products.length) return null;

    const totalPrice = products.reduce((acc, product) => {
      const quantity = product.quantity ?? 0;

      let price = getProductPrice(
        product,
        orderType?.id as number,
        false
      ) as number;

      const diskon = product.adjustment?.discountAmount ?? 0
      const surchargeAmount = product.adjustment?.surchargeAmount ?? 0

      if (diskon > 0) {
        price -= diskon;
      }

      return acc + quantity * price + surchargeAmount;
    }, 0);

    return totalPrice;
  };

  const handleToggleProduct = (product: Catalogues) => {
    const existingProduct = selected.find((item) => item.id === product.id);
  
    if (existingProduct) {
      const stock = getProductStock(existingProduct) as number;
      if (existingProduct.quantity >= stock) {
        return;
      }
  
      handleQuantityUpdate(existingProduct.id, existingProduct.quantity + 1);
    } else {
      setSelected((prevSelected) => [{ ...product, quantity: 1 }, ...prevSelected]);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleKeyDownSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setFlagAutoAssignProduct(false)
    if (event.key == 'Enter' && inputSearch && inputSearch.current) {
      setFlagAutoAssignProduct(true)
    }
  }

  const handleQuantityUpdate = (productId: number, newQuantity: number) => {
    setSelected((prevSelected) =>
      newQuantity > 0
        ? prevSelected.map((item) =>
            item.id === productId
              ? { ...item, quantity: newQuantity, selected: true }
              : item
          )
        : prevSelected.filter((item) => item.id !== productId)
    );
  };

  const submitProducts = useCataloguesStore(
    (state) => state.setSelectedProductsState
  );

  const submitOrder = useOrderStore((state) => state.setOrder);

  const mapProductToOrder = (
    product: Catalogues,
    orderTypeId: number,
    customerOrderId?: number | null
  ): Products => ({
    customer_order_detail_id: customerOrderId,
    product_id: product.id,
    brand_id: 1, // Temporary
    order_type_id: orderTypeId,
    product_unit_id: product.product_unit_id,
    product_category_id: product.product_category_id,
    catalogue_detail_id: 1, // Temporary
    quantity: product.quantity,
    custom_price: false,
    stock: getProductStock(product) as number,
    sell_price: getProductPrice(product, orderTypeId, false) as number, // Temporary placeholder
  });

  const handleGeneratePayload = (selectedProducts: Catalogues[], orderProducts?: Product[]) => {
    const products = selectedProducts.map((product) => {
      let customerOrderId: number | undefined | null = undefined
      if (orderProducts) {
        customerOrderId = orderProducts.find((orderProduct) => orderProduct.product_id == product.id)?.customer_order_detail_id
      }

      const temp = mapProductToOrder(product, orderType?.id as number, customerOrderId) as any;

      if (product.adjustment) {
        temp["adjustment"] = product.adjustment
      }

      return temp;
    });

    return {
      location_id: id,
      order_type_id: orderType?.id as number,
      products,
    };
  };

  const handleSubmitProducts = () => {
    setErrorMessage('');

    if(!kasir) {
      setErrorMessage('Pilih sales terlebih dahulu sebelum melanjutkan.')
      return
    }

    const newOrder = handleGeneratePayload(selected, order?.products) as Order;

    submitOrder(newOrder, orderType?.id as number, subTotal, customer as Customer, kasir?.id);
    saveOrderLocalStorage(newOrder, orderType?.id as number, subTotal, customer as Customer, kasir?.id);
    submitProducts(selected);

    // hitung promo
    setMappingSubmit(true, order?.adjustment?.amount ?? 0, order?.adjustment?.is_percentage ?? false ? '%' : '');
  };

  const saveOrderLocalStorage = (order: Order, orderTypeId: number, total: number, customer: Customer, employee_sales_id: number | undefined) => {
    const tempOrder = {
      order,
      orderTypeId,
      total,
      customer,
      employee_sales_id
    }

    localStorage.setItem("orders", JSON.stringify(tempOrder));
  }

  const onSubmitCustomer = (customer: Customer) => {
    setCustomer(customer);
    setOpenPelanggan(false);
  }

  const onSelectOrder = (order: CustomerOrder) => {
    const products: Product[] = order.customer_order_details.map((detail) => {
      return {
        customer_order_detail_id: detail.id,
        brand_id: detail.brand_id,
        adjustment: detail.adjustment,
        custom_price: detail.custom_price,
        product: detail.product,
        product_category: detail.product_category,
        product_unit: detail.product_unit,
        product_id: detail.product_id,
        product_category_id: detail.product_category_id,
        product_unit_id: detail.product_unit_id,
        promo: detail.promo,
        order_type_id: detail.order_type_id,
        order_type: detail.order_type,
        quantity: detail.quantity,
        sell_price: Number(detail.sell_price),
      } as Product
    });

    const catalogues: Catalogues[] = order.customer_order_details.map((detail) => {
      const product_location_stock = detail.product.product_location_stocks?.find((location) => location.location_id == order.location_id)
      const product_sell_price = detail.product.product_sell_prices?.find((location) => location.location_id == order.location_id)

      return {
        id: detail.product_id,
        code: detail.product.code,
        barcode: detail.product.barcode,
        adjustment: detail.adjustment,
        name: detail.product_name,
        product_category: detail.product_category,
        product_category_id: detail.product_category_id,
        product_unit_id: detail.product_unit_id,
        quantity: detail.quantity,
        sell_price: detail.sell_price,
        sku: detail.product.sku,
        product_location_stock: product_location_stock,
        product_sell_price: product_sell_price,
        product_sell_prices: detail.product.product_sell_prices,
      } as Catalogues
    });
    const promos: Promo[] = [];

    const sales = {
      products: products,
      promos: promos,
      totalItem: 0,
      customer: order.customer,
      totalAmount: Number(order.total_amount),
      paymentPlatformFee: order.payment_platform_fee,
      serviceCharge: order.service_charge,
      adjustment: order.adjustment,
      taxExclusiveAmount: order.tax_exclusive_amount,
      taxInclusiveAmount: order.tax_inclusive_amount,
      subTotal: order.subtotal,
      customerOrderId: order.id,
    } as SaleDataResponse

    if (catalogues) {
      setSelected(catalogues);
      submitProducts(catalogues);
    }
    setId(order.location_id);

    setOrder(sales)
    setCustomer(order.customer)
    setCustomerOrderId(order.id)
    setOpenOrder(false)
  }

  const onSubmitKasir = (kasir: Kasir) => {
    setKasir(kasir)
    setOpenKasir(false)
  }

  const onSubmitDiskon = (diskon: number, state: string) => {
    setLoadingDiskon(true);
    setOpenDiskon(false)

    // hitung promo
    setMappingSubmit(false, diskon, state);
  }

  const addDiskonProduct = (product: Catalogues) => {
    setProductDiskon(product);
    setOpenDiskon(true)
  }

  const deleteDiskonProduct = (product: Catalogues) => {
    setLoadingDiskon(true);
    
    // hitung promo
    setMappingSubmit(false, 0, 'DELETE_DISKON', product);
  }

  const setMappingSubmit = (isSubmit: boolean, diskon: number, state: string = '', product: Catalogues | null = null) => {
    const tempOrder = handleGeneratePayload(selected, order?.products) as Order;

    const checkPromoData = {
      customer_order_id: customerOrderId,
      location_id: id,
      order_type_id: orderType?.id,
      products: tempOrder.products
    } as any;

    if(diskon !== 0) {
      const is_percentage = isSubmit ? (order?.adjustment?.is_percentage ?? false) : (state === '%')

      if(productDiskon){
        checkPromoData.products = checkPromoData.products?.map((data: any) => {
          if (productDiskon.id === data.product_id) {
            data["adjustment"] ={
              quantity: 1,
              amount: diskon,
              free_of_charge: false,
              is_percentage
            }
          }

          return data
        })

        if(order?.adjustment){
          checkPromoData["adjustment"] = {
            quantity: order.adjustment.quantity,
            amount: order.adjustment.amount,
            free_of_charge: false,
            is_percentage: order.adjustment.is_percentage
          }
        }
      }  else {
        checkPromoData["adjustment"] = {
          quantity: 1,
          amount: diskon,
          free_of_charge: false,
          is_percentage
        }
      }
    } else if (state == 'DELETE_DISKON' && product) {
      checkPromoData.products = checkPromoData.products?.map((data: any) => {
        if (product.id === data.product_id) {
          delete data.adjustment
        }

        return data
      })
    }

    if(customer){
      checkPromoData["customer"] = customer;
    }

    checkPromo.mutate(checkPromoData, {
      onSuccess: (data) => {
        const tempOrder = data.data ?? ""
        localStorage.setItem("orderWithPromo", JSON.stringify(tempOrder));

        if (customerOrderId) {
          localStorage.setItem("customerOrderId", customerOrderId.toString());
        }

        setSelected((prev) => {
          return prev.map((data) => {
            const promo = tempOrder && tempOrder.products.find((temp: any) => temp.product_id === data.id);

            if(promo?.adjustment){
              data["adjustment"] = promo.adjustment;
            } else {
              data["adjustment"] = null
            }

            return data;
          })
        })
        setOrder(tempOrder)
        setLoadingDiskon(false)
        setProductDiskon(null)

        if(isSubmit) {
          router.push(`/${locale}/kasir/pembayaran`);
        }
      },
      onError: () => {
        setLoadingDiskon(false)
        setProductDiskon(null)
      }
    })
  }

  const onDeleteTransaction = () => {
    showConfirmationDeletePermanentAlert('order?', () => {
      showToastSuccess("Berhasil menghapus Order");
      // localStorage
      localStorage.removeItem("orders");
      localStorage.removeItem("selected");
      localStorage.removeItem("orderWithPromo")
      localStorage.removeItem("customerOrderId");
      // clear store
      useOrderStore.setState({ order: undefined, orderTypeId: 0, amount: 0});
      useCataloguesStore.setState({ products: [] });
      // local state
      setSelected([])
      setCustomer(undefined)
      setCustomerOrderId(undefined)
      setOrder(null)
    })
  }

  const buildAdjustment = (adjustment?: Adjustment) => {
    if (!adjustment || adjustment.amount == 0) {
      return <></>
    }

    const label = adjustment.amount < 0 ? 'Diskon' : 'Biaya Penambahan'
    const addLabel = adjustment.is_percentage ? '(' +adjustment.amount + '%)' : ''
    const totalAmount = adjustment.amount < 0 ? adjustment.discountAmount : adjustment.surchargeAmount

    return (
      <FlexedText
        leftText={label + addLabel}
        rightText={`${formatRupiah(totalAmount)}`}
      />
    )
  }

  return (
    <main className="pt-4 w-full md:relative md:w-auto flex justify-center gap-4">
      {
        loadingDiskon && <LoadingPage title="Lagi menghitung promo..." />
      }

      <section className={`px-4 w-full mb-24 md:mb-0 md:p-0 md:w-3/5 md:relative md:block ${menuMobile === 'produk' ? 'block' : 'hidden'}`}>
        <div className="md:hidden">
          <HeaderSummery 
            setOpenPelanggan={setOpenPelanggan} 
            customer={customer} 
            orderType={orderType} 
            setOpenListOrder={setOpenOrder}
            setOrderType={setOrderType} 
            clearCustomer={() => setCustomer(undefined)} 
            setOpenKasir={setOpenKasir} 
            kasir={kasir} 
            clearKasir={() => setKasir(null)} 
            selected={selected}
          />
        </div>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            ref={inputSearch}
            placeholder="Cari menu ..."
            onChange={handleInputChange}
            onKeyDown={handleKeyDownSearch}
            className="text-xs md:text-base"
          />
          <Button type="submit" onClick={handleRefetch} className="text-xs md:text-base">
            <IoIosSearch size={24} />
          </Button>
        </div>

        {!isPending && data && data.length > 0 && (
           <>
           <ScrollArea className="h-[60vh] md:h-[500px]">
             <CashierDisplay
               flagAutoAssignProduct={flagAutoAssignProduct}
               selectedProduct={selected}
               onToggleProduct={handleToggleProduct}
               data={data}
             />
           </ScrollArea>
           <div className="flex items-center gap-2 mt-4">
             <Button
               type="button"
               className="btn-xs text-xs"
               onClick={handlePrevCatalogue}
               disabled={prevCursor == null}
             >
               {'<'}
             </Button>
             <Button
               type="button"
               className="btn-xs text-xs"
               onClick={handleNextCatalogue}
               disabled={nextCursor == null}
             >
               {'>'}
             </Button>
           </div>
         </>
        )}

        {
          !isPending && data && data.length === 0 && (
            <div className="flex justify-center items-center h-[200px]">
              <p className="text-sm">Produk tidak ditemukan</p>
            </div>
          )
        }

        {
          isPending && (
            <div className="flex justify-center items-center h-[200px]">
              <p className="text-sm">Memuat data...</p>
            </div>
          )
        }
      </section>

      <section className={`px-4 w-full md:p-0 md:border md:rounded-lg md:relative md:w-1/2 xl:w-1/3 md:min-h-[calc(100vh-300px)] md:block ${menuMobile === 'daftar' ? 'block' : 'hidden'}`}>
        {/* Customer */}
        <HeaderSummery 
          setOpenPelanggan={setOpenPelanggan} 
          customer={customer} 
          orderType={orderType} 
          setOpenListOrder={setOpenOrder}
          setOrderType={setOrderType} 
          clearCustomer={() => setCustomer(undefined)} 
          setOpenKasir={setOpenKasir} 
          kasir={kasir} 
          selected={selected} 
          clearKasir={() => setKasir(null)} 
        />

        <div>
          {/* Product cart quantity */}
          <section className="md:p-4">
            <ScrollArea style={{ height: '250px' }}>
              {selected?.map((val: Catalogues) => {
                return (
                  <ProductQuantity
                    onQuantityUpdate={handleQuantityUpdate}
                    addDiskonProduct={addDiskonProduct}
                    deleteDiskonProduct={deleteDiskonProduct}
                    product={val}
                    orderType={orderType?.id as number}
                    key={val.id}
                  />
                );
              })}
            </ScrollArea>
          {/* 
            <div className="h-[200px] bg-red-300"></div> */}
          </section>

          {/* Sub Total */}
          <section className="fixed w-full bottom-0 bg-white md:w-1/2 xl:w-1/3 md:p-4 mb-4">
            <Separator className="my-4" />

            {/* Subtotal */}  
            <div className="flex flex-col gap-2 w-[90%] md:w-full">
              <FlexedText
                leftText="Subtotal"
                rightText={formatRupiah(subTotal as number)}
              />
              {
                order?.adjustment && buildAdjustment(order?.adjustment)
              }
              {
                order?.promos && order?.promos.length > 0 && (
                  order.promos.map((promo: Promo) => (
                    <FlexedText
                      leftText={promo.promoName}
                      key={promo.promoId}
                      rightText={formatRupiah(promo.appliedPromoAmount)}
                    />
                  ))
                )
              }
              {/* <FlexedText
                    leftText="Pajak (10%)"
                    rightText={formatRupiah((totalAmount as number) * 0.1)}
                  /> */}
              <FlexedText
                leftText="Total Barang"
                rightText={formatRupiah((order?.totalItem ?? totalItem) as number)}
              />
              <FlexedText
                leftText="Total"
                rightText={formatRupiah((order?.totalAmount ?? totalAmount) as number)}
              />
            </div>

            {/* Bottom buttons */}
            <div className="w-[90%] md:w-full flex gap-3 xxl:gap-5 mt-6">
              <Button
                type="button"
                className="basis-1/5 text-xs"
                disabled={!selected.length}
                onClick={onDeleteTransaction}
              >
                <MdOutlineCancel size={20} />
              </Button>

              <Button
                type="button"
                className="basis-1/5"
                disabled={!selected.length}
                onClick={() => {
                  setOpenDiskon(true)
                  setProductDiskon(null)
                }}
              >
                <CiDiscount1 size={20} />
              </Button>

              <Button
                type="submit"
                className="w-full"
                onClick={handleSubmitProducts}
                disabled={!selected.length || checkPromo.isPending}
              >
                <p className="font-semibold text-xs md:text-base">{checkPromo.isPending ? 'Memprosing Order' : 'Proses'}</p>
              </Button>
            </div>
             {errorMessage && ( <p className="mt-2 text-sm text-red-500">*{errorMessage}</p>)}
             <div className="h-20"></div>
          </section>
        </div>
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
              onClick={() => setMenuMobile('produk')}
            >
              <p className={`text-xs md:text-base ${menuMobile === 'produk' && 'text-primary'} flex items-center gap-1`}><AiFillProduct /> Produk</p>
            </Button>
            <Button
              type="button"
              className="w-1/2"
              variant="ghost"
              onClick={() => setMenuMobile('daftar')}
            >
              <p className={`text-xs md:text-base ${menuMobile === 'daftar' && 'text-primary'} flex items-center gap-1`}><IoMdCart /> Daftar Pesanan {selected.length > 0 && <span className="text-xs flex items-center justify-center bg-red-600 w-[20px] h-[20px] rounded-full text-white">{selected.length}</span>}</p>
            </Button>
          </div>
        </div>
      }

      {/* Section Popup */}
      <CustomerPage isTriggerOpen={openPelanggan} location_id={id} onClose={() => setOpenPelanggan(false)} onSubmit={onSubmitCustomer} />
      <EnployeePopup isTriggerOpen={openKasir} location_id={id} onClose={() => setOpenKasir(false)} onSubmit={onSubmitKasir}/>
      <Discount product={productDiskon} total={subTotal} onClose={() => setOpenDiskon(false)} isTriggerOpen={openDiskon} onSubmit={onSubmitDiskon}/>
      <OpenOrderPage isTriggerOpen={openOrder} location_id={id} onClose={() => setOpenOrder(false)} order={order} empSalesId={kasir?.id} onSelect={onSelectOrder}/>
    </main>
  );
};

export default KeranjangPage;
