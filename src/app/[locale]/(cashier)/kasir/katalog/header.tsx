"use client"

import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
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
       <div className="flex justify-between font-semibold text-lg bg-primary rounded-md md:rounded-none p-2 md:p-4 items-center mb-4 md:mb-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 items-center hover:cursor-pointer bg-white p-2 text-primary rounded-md" >
              {!customer && <IoPersonAdd className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]"/>}
              <p className="font-semibold text-xs md:text-sm md:mx-2" onClick={() => setOpenPelanggan(true)}>{customer ? `${customer?.first_name} ${customer?.last_name}` : 'Member'}</p>
              {customer && (
                <div className="cursor-pointer" onClick={clearCustomer}>
                  <IoMdCloseCircle color="red" />
                </div>
              )}
            </div>
            <div className="flex gap-1 items-center hover:cursor-pointer bg-white p-2 text-primary rounded-md" >
              {!kasir && <IoPersonAdd className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]"/>}
              <p className="font-semibold text-xs md:text-sm md:mx-2" onClick={() => setOpenKasir(true)}>{kasir ? `${kasir?.first_name} ${kasir?.last_name}` : 'Sales'}</p>
              {kasir && (
                <div className="cursor-pointer" onClick={clearKasir}>
                  <IoMdCloseCircle color="red" />
                </div>
              )}
            </div>
          </div>
              
          <div className="flex gap-1 items-center bg-yellow-200 p-2 text-primary rounded-md" >
            <p className="font-semibold text-xs md:text-sm md:mx-2">
              {session?.user.name?.toUpperCase()}
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