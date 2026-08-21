"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoSearch } from "react-icons/io5";
import { useGetEmpLocationsQuery } from "@/app/api/employee-location/query";
import { useAuthStoreMutation } from "@/app/api/store/mutation";
import { useLogoutMutation } from "@/app/api/authentication/mutation";
import { AuthStore } from "@/app/api/store/type";

interface ValidationsStorePageProps { }

const ValidationsStorePage: FC<ValidationsStorePageProps> = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const locale = useLocale();
  const router = useRouter();

  const { data: session } = useSession();

  // Ambil entity ID atau nama langsung dari selected_entity
  const selectedEntity = (session?.user as any)?.selected_entity;
  const entityId = selectedEntity?.id ?? 3;
  const rawName = selectedEntity?.name ?? (entityId === 1 ? "Secaca" : "Zakiah");
  const brandName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

  const { data, isPending } = useGetEmpLocationsQuery(100);
  const authStore = useAuthStoreMutation();

  useEffect(() => {
    if (!data) return;

    const locations = data.data ?? []

    if (!locations) return;
    if (locations.length == 1) {
      createAuth(locations[0].location_id)
    }
  }, [isPending])

  const onClickKasir = () => {
    const location_id = data?.data.find(
      (data: any) => data.location.name === value
    )?.location_id;

    if (!location_id) {
      return;
    }

    createAuth(location_id)
  };

  const createAuth = (location_id: number) => {
    const body = {
      device_id: "random",
      device_name: "random",
      device_type: "cashier",
      location_id: +location_id,
    } as AuthStore;

    authStore.mutate(body, {
      onSuccess: (data) => {
        const dataLocation = data?.data.device.location;
        const deviceCode = data?.data.device.code;
        localStorage.setItem("location", JSON.stringify(dataLocation));
        localStorage.setItem("deviceCode", deviceCode);

        return router.push(`/${locale}/kasir/katalog`);
      },
      onError: () => {
        console.log("Error Auth Store");
      },
    });
  }

  const onLogout = useLogoutMutation();
  const onClickLogOut = () => {
    if (isPending || authStore.isPending) return
    
    onLogout.mutate(undefined, {
      onSuccess() {
        signOut()
        localStorage.clear()
      },
      onError: () => {
        signOut()
        localStorage.clear()
        sessionStorage.clear()
      },
    })
  }

  return (
    <div className="relative w-full h-screen p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary rounded-lg p-10">
        <div className="font-semibold text-center text-lg md:text-2xl mb-2">
          Selamat datang di {brandName}
        </div>
        <div className="text-xs md:text-base text-gray-500 text-center mb-10">
          Silakan pilih akses lokasi toko dibawah ini
        </div>
        <div className="flex flex-col items-center gap-6 text-xs md:text-base">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[250px] md:w-[450px] justify-start gap-4 text-xs md:text-base"
              >
                <IoSearch className="ml-2 h-4 w-4 shrink-0" />
                {value
                  ? data?.data.find((data: any) => data.location.name === value)
                    ?.location?.name
                  : "Pilih lokasi toko..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] md:w-[450px] p-0">
              <Command>
                <CommandInput className="text-xs md:text-base" placeholder="Cari lokasi Toko..." />
                <CommandList>
                  <CommandEmpty>Lokasi toko tidak ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {isPending ? (
                      <CommandItem className="flex justify-center text-xs md:text-base">
                        Sedang mendapatkan data ....
                      </CommandItem>
                    ) : (
                      data?.data.map((data: any) => (
                        <CommandItem
                          className="text-xs md:text-base"
                          key={data.location_id}
                          value={data.location.name}
                          onSelect={(currentValue) => {
                            if (authStore.isPending) return;

                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          {data.location.name}
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button
            onClick={onClickKasir}
            className="w-[250px] md:w-[450px] text-xs md:text-base"
            disabled={!value || authStore.isPending || isPending}
          >
            {authStore.isPending ? "Processing..." : "Masuk"}
          </Button>
        </div>
        <div className="flex justify-center items-center text-gray-500 gap-10 my-10 text-xs md:text-base">
          <p>Akhiri sesi untuk akun saat ini, <span className="text-primary font-semibold underline cursor-pointer" onClick={onClickLogOut}>Keluar</span></p>
        </div>
      </div>
    </div>
  );
};

export default ValidationsStorePage;