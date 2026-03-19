"use client";

import { FC, useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { usePathname, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FaLocationDot } from "react-icons/fa6";
import { capitalizeWords } from "@/lib/helpers";
import { Separator } from "@/components/ui/separator";
import { useLogoutMutation } from "@/app/api/authentication/mutation";
import { useLocale } from "next-intl";

interface CashierFooterTabProps {
  onHandleClick: (route: string) => void;
  activeRoute: (route: string[]) => boolean;
  title: string;
}

const CashierFooterTab: FC<CashierFooterTabProps> = (props) => {
  const { onHandleClick, activeRoute, title } = props;

  return (
    <div
      className={`flex-1 text-center font-medium h-full py-3 md:py-5 flex items-center justify-center ${
        activeRoute(["katalog", "pembayaran"]) ? "bg-blue-700" : ""
      }`}
    >
      <button className="w-full text-xs md:text-sm" onClick={() => onHandleClick('katalog')}>{title}</button>
  </div>
  )
}

interface CashierFooterBarProps {}

const CashierFooterBar: FC<CashierFooterBarProps> = () => {
  const { data: session } = useSession() 
  const locale = useLocale();
  const router = useRouter();

  const [location, setLocation] = useState<any>(null);

  const onLogout = useLogoutMutation();

  const pathname = usePathname();
  const lastPathname = pathname.split("/").pop() || "";

  const activeRoute = (route: string[]) => {
    if (route.includes(lastPathname)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const location = JSON.parse(localStorage.getItem("location") as string);
    setLocation(location);
  }, [])

  const onHandleClick = (route: string) => {
    const url = `${locale}/kasir/${route}`;
    router.push(`/${url}`);
  }

  const logout = () => {
    onLogout.mutate(undefined, {
      onSuccess: () => {
          signOut()
          localStorage.clear()
          sessionStorage.clear()
      },
      onError: () => {
        signOut()
        localStorage.clear()
        sessionStorage.clear()
      }
    })
  }

  return (
    <footer className="fixed bottom-0 w-full bg-primary text-white">
      <Sheet>
        <div className="mx-auto justify-between items-stretch flex">
          <div className="flex justify-between items-stretch w-full h-full">
            <div className="w-[68px] text-center font-medium h-full py-2 md:py-5 flex items-center justify-center ">
              <SheetTrigger><GiHamburgerMenu size={20} className="inline-block mr-2" /></SheetTrigger>
            </div>
            <CashierFooterTab onHandleClick={() => onHandleClick('katalog')} activeRoute={() => activeRoute(["katalog", "pembayaran"])} title="POS"/>
            <CashierFooterTab onHandleClick={() => onHandleClick('invoice')} activeRoute={() => activeRoute(["invoice"])} title="Struk" />
            <CashierFooterTab onHandleClick={() => onHandleClick('rekapan')} activeRoute={() => activeRoute(["rekapan"])} title="Rekap" />
            <CashierFooterTab onHandleClick={() => onHandleClick('barang')} activeRoute={() => activeRoute(["barang"])} title="Stok" />
          </div>
        </div>
        
        <SheetContent className="bg-white" side="left" >
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
            <ScrollArea className="pb-20 h-screen">
                <div className="flex flex-col justify-between">
                    <div className="w-full">
                      <div className="flex flex-col items-center justify-center">
                        <Avatar className="w-[100px] h-[100px]" >
                            <AvatarFallback>{session?.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold mt-2 text-sm md:text-lg">{session?.user.name?.toUpperCase()}</p>
                        <div className="flex gap-2 items-center mt-3">
                          <FaLocationDot color="red"/>
                          <p className="text-slate-500 text-xs md:text-base">{capitalizeWords(location?.name)}</p>
                        </div>
                      </div>
                      <div className="mt-20 flex flex-col gap-4 ">
                        <Button onClick={() => onHandleClick('../validate-roles')} type="button" className="mb-8 text-xs md:text-base">Pilih Toko</Button>
                        <Button onClick={() => onHandleClick('katalog')} type="button" className="text-xs md:text-base">POS</Button>
                        <Button onClick={() => onHandleClick('invoice')} type="button" className="text-xs md:text-base">Struk</Button>
                        <Button onClick={() => onHandleClick('rekapan')} type="button" className="text-xs md:text-base">Rekap</Button>
                        <Button onClick={() => onHandleClick('barang')} type="button"  className="text-xs md:text-base">Stok</Button>
                        <Separator className="mt-20"/>
                        <Button className="bg-red-500 hover:bg-red-600 text-white w-full text-xs md:text-base" onClick={logout} type="button">Keluar</Button>
                      </div>
                      <div className="mt-10">
                      </div>
                    </div>
                </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
            
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </footer>
  );
};

export default CashierFooterBar;
