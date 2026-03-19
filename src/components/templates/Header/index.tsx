"use client"

import { useLogoutMutation } from "@/app/api/authentication/mutation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { capitalizeFirstLetter } from "@/lib/helpers";
import { signOut, useSession } from "next-auth/react";
import { FC } from "react";
import { MdLogout } from "react-icons/md";

interface HeaderProps {
    
}
 
const Header: FC<HeaderProps> = () => {
    const { data: session, status } = useSession()
    const onLogout = useLogoutMutation();

    const logout = () => {
        onLogout.mutate(undefined, {
          onSuccess() {
              signOut()
              localStorage.clear()
          },
        })
    }

    if (status == 'loading' || onLogout.isPending) {
        return (
            <header className="flex justify-between items-center p-5 shadow-md">
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex flex-col gap-1">
                    <Skeleton className="rounded-2xl w-[200px] h-5" />
                    <Skeleton className="rounded-2xl w-[100px] h-5" />
                </div>
            </div>

            <Skeleton className="rounded-2xl w-[100px] h-10" />
        </header>
        )
    }

    if (status == 'unauthenticated') {
        signOut();
    }

    const name = session?.user.name ?? ''
    const firstLetter = name ? name[0] : '?'

    return ( 
        <header className="flex justify-between items-center p-5 shadow-md">
            <div className="flex items-center gap-4">
                <div className="rounded-full w-12 h-12 bg-blue-100 flex justify-center items-center">
                    <h1 className="font-bold text-white text-2xl">{firstLetter}</h1>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm">Selamat Datang,</span>
                    <h1 className="font-semibold">{capitalizeFirstLetter(name)}</h1>
                </div>
            </div>

            <Button variant="destructive" className="ml-auto" onClick={logout}>
                <MdLogout  className="mr-2"/> Keluar
            </Button>
        </header>
     );
}
 
export default Header;