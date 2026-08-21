"use client"

import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { IoIosRadioButtonOn, IoMdCloseCircle } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import DropdownMenuOrderType from "./dropDown";
import { Customer, Kasir } from "@/types/order";
import { IoPersonAdd } from "react-icons/io5";
import { OrderTypes } from "@/app/api/order-type/type";
import { Catalogues } from "@/app/api/catalogues/type";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

interface HeaderSummaryProps {
    setOpenPelanggan: (state: boolean) => void,
    setOpenKasir: (state: boolean) => void,
    setOpenListOrder: (state: boolean) => void,
    customer: Customer | undefined,
    kasir: Kasir | null,
    orderType: OrderTypes | undefined,
    selected: Catalogues[] | undefined,
    setOrderType: Dispatch<SetStateAction<OrderTypes | undefined>>,
    clearCustomer: () => void,
    clearKasir: () => void
  }
  
const HeaderSummery : FC<HeaderSummaryProps> = ({
    setOpenPelanggan,
    setOpenKasir,
    setOpenListOrder,
    customer,
    kasir,
    orderType,
    selected,
    setOrderType,
    clearCustomer,
    clearKasir
  }) => {
    const [dateNow, setDateNow] = useState<string>("")

    const { data: session } = useSession() 
  
    useEffect(() => {
      const tempDate = new Date().toLocaleDateString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    
      setDateNow(tempDate)
    }, []);
  
    return (
      <>
       <div className="flex flex-wrap justify-between gap-2 font-semibold text-lg bg-primary rounded-md md:rounded-none p-2 md:p-4 items-center mb-4 md:mb-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
            <div className="flex gap-1 items-center hover:cursor-pointer bg-white px-2 py-1.5 text-primary rounded-md max-w-[160px] md:max-w-[220px]">
              {!customer && <IoPersonAdd className="shrink-0 w-[14px] h-[14px] md:w-[18px] md:h-[18px]"/>}
              <p
                className="font-semibold text-xs md:text-sm mx-1 truncate capitalize"
                onClick={() => setOpenPelanggan(true)}
                title={customer ? `${customer?.first_name} ${customer?.last_name}` : 'Member'}
              >
                {customer ? `${customer?.first_name} ${customer?.last_name}`.toLowerCase() : 'Member'}
              </p>
              {customer && (
                <div className="shrink-0 cursor-pointer" onClick={clearCustomer}>
                  <IoMdCloseCircle color="red" />
                </div>
              )}
            </div>

            <div className="flex gap-1 items-center hover:cursor-pointer bg-white px-2 py-1.5 text-primary rounded-md max-w-[160px] md:max-w-[220px]">
              {!kasir && <IoPersonAdd className="shrink-0 w-[14px] h-[14px] md:w-[18px] md:h-[18px]"/>}
              <p
                className="font-semibold text-xs md:text-sm mx-1 truncate capitalize"
                onClick={() => setOpenKasir(true)}
                title={kasir ? `${kasir?.first_name} ${kasir?.last_name}` : 'Sales'}
              >
                {kasir ? `${kasir?.first_name} ${kasir?.last_name}`.toLowerCase() : 'Sales'}
              </p>
              {kasir && (
                <div className="shrink-0 cursor-pointer" onClick={clearKasir}>
                  <IoMdCloseCircle color="red" />
                </div>
              )}
            </div>
          </div>

          <div
            className="shrink-0 flex gap-1.5 items-center px-2.5 py-1.5 rounded-md max-w-[140px]"
            style={{
              backgroundColor: "rgba(255,255,255,0.95)",
              boxShadow: "0 0 0 1px rgba(34,197,94,0.4)",
              color: "#15803d",
            }}
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "#22c55e" }}
              ></span>
              <IoIosRadioButtonOn
                className="relative w-2.5 h-2.5"
                style={{ color: "#22c55e" }}
              />
            </span>
            <p
              className="font-semibold text-xs md:text-sm truncate capitalize"
              title={session?.user.name ?? ""}
            >
              {session?.user.name?.toLowerCase()}
            </p>
          </div>

          <div className="hidden">
            <DropdownMenuOrderType order={orderType} setOrder={setOrderType} />
          </div>
        </div>
      
        <div className="px-4 hidden md:block">
          <div className="flex justify-between py-4">
            <p className="font-semibold text-slate-500">
              Daftar pesanan ({selected?.length ?? 0})
            </p>
            <div className="flex gap-1 items-center hover:cursor-pointer bg-white p-1 text-primary rounded-md" >
              <p className="font-semibold text-xs md:text-sm md:mx-2" onClick={() => setOpenListOrder(true)}>
                Pesanan
              </p>
            </div>
          </div>
  
          <Separator />
        </div>
      </>
    )
  }
  
  export default HeaderSummery