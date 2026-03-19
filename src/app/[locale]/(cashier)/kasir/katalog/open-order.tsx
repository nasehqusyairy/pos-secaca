"use client"

import { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGetCustomerOrderQuery } from "@/app/api/customer_order/queries";
import { CustomerOrder, GetCustomerOrderQuery } from "@/app/api/customer_order/type";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import { OpenOrderTable } from "./order-order/table";
import { OpenOrderColumn } from "./order-order/column";
import FooterTableCursorServer from "@/components/organisms/FooterTableCursorServer";
import { SaleDataResponse } from "@/types/response/calculate_promo";
import { useCreateOrderMutation, useUpdateOrderMutation } from "@/app/api/customer_order/mutation";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { RefreshCw } from "lucide-react";

interface OpenOrderPageProps {
  isTriggerOpen: boolean;
  location_id: number;
  empSalesId?: number | null;
  order: SaleDataResponse | null,
  onClose: () => void;
  onSelect: (order: CustomerOrder) => void;
}

const OpenOrderPage: FC<OpenOrderPageProps> = ({
  isTriggerOpen,
  location_id,
  onSelect,
  onClose,
  order,
  empSalesId,
}) => {
  // Use the hook properly at the top level
  const [limit, setLimit] = useState<number>(10);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const createOrderMutation = useCreateOrderMutation();
  const updateOrderMutation = useUpdateOrderMutation();

  const param = {
    limit,
    cursor,
    locs: [location_id],
    statuses: ['initiate']
  } as GetCustomerOrderQuery
  const { data, isFetching, refetch } = useGetCustomerOrderQuery(param);

  const handleClick = () => {
    if (cursor) {
      setCursor(undefined)
    } else {
      refetch()
    }
  }

  useEffect(() => {
    handleClick()
  }, [limit])

  const handleSubmit = () => {
    if (createOrderMutation.isPending || updateOrderMutation.isPending || !order) return

    // Create order
    const orderPayload = {
      ...order,
      location_id: location_id,
      order_type_id: 1,
      employee_sales_id: empSalesId,
      customer_order_id: order.customerOrderId,
      products: order.products.map((product: any) => {
        if (!product.adjustment) {
          delete product.adjustment;
        }

        // ADD ORDER DETAIL ID
        if (product.customer_order_detail_id) {
          product['id'] = product.customer_order_detail_id
        }

        return product;
      }),
      payments: []
    } as any;
    
    if (!orderPayload.customer) {
      delete orderPayload.customer
    }

    if (order.customer) {
      orderPayload["customer"] = order.customer
    }

    const isDebug = false
    if (isDebug) {
      return
    }

    if (order?.customerOrderId) {
      updateOrder(orderPayload)
    } else {
      createOrder(orderPayload)
    }
  }

  const createOrder = (orderPayload: any) => {
    if (order?.customerOrderId) return

    createOrderMutation.mutate(orderPayload, {
      onSuccess: () => {
        showToastSuccess("Berhasil menyimpan pesanan");
        onClose()
      },
      onError: () => {
        showToastError("Gagal menyimpan pesanan");
      }
    });
  }

  const updateOrder = (orderPayload: any) => {
    if (!order?.customerOrderId) return

    updateOrderMutation.mutate(orderPayload, {
      onSuccess: () => {
        showToastSuccess("Berhasil menyimpan pesanan");
        onClose()
      },
      onError: () => {
        showToastError("Gagal menyimpan pesanan");
      }
    });
  }

  const handleRefresh = () => {
    refetch()
  }

  return (
    <Dialog open={isTriggerOpen}>
      <DialogContent className={cn("bg-white w-96 rounded-md md:w-full [&>button]:hidden")}>
        <DialogHeader className="flex-row justify-between">
          <DialogTitle className="text-lg md:text-2xl font-semibold">Daftar Pesanan</DialogTitle>
          <Button type="button" size='icon' onClick={handleRefresh}>
            <RefreshCw />
          </Button>
        </DialogHeader>
        <div>
          {
            isFetching ? <SkeletonSimple /> : <OpenOrderTable columns={OpenOrderColumn({ onSelect: onSelect })} data={data?.data.data} />
          }
          <FooterTableCursorServer
            nextCursor={data?.data.nextCursor}
            prevCursor={data?.data.prevCursor}
            setPageSize={setLimit}
            setCursor={setCursor}
          />
        </div>
        <DialogFooter>
          <div className="flex gap-2">
            <Button
              disabled={createOrderMutation.isPending || updateOrderMutation.isPending}
              variant="outline"
              className="border-primary text-primary text-xs md:text-base"
              onClick={handleSubmit}>
              {(createOrderMutation.isPending || updateOrderMutation.isPending) ? 'Memproses..' : 'Simpan Pesanan'}
            </Button>
            <Button variant="secondary" className="text-xs md:text-base" onClick={onClose}>Kembali</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OpenOrderPage;