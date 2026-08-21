"use client";

import { useLogoutMutation } from "@/app/api/authentication/mutation";
import { signOut, useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useMemo } from "react";

interface ValidationsRolesPageProps {}

const ValidationsRolesPage: FC<ValidationsRolesPageProps> = () => {  
  const locale = useLocale();
  const router = useRouter();

  const { data: session } = useSession();

  const selectedEntity = (session?.user as any)?.selected_entity;
  const entityId = selectedEntity?.id ?? 3;
  const isSecaca = entityId === 1 || selectedEntity?.code === "secaca";

  const logoName = isSecaca ? "secaca.png" : "zakiah.png";
  const rawName = selectedEntity?.name ?? (isSecaca ? "Secaca" : "Zakiah");
  const brandName = useMemo(() => {
    return rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
  }, [rawName]);

  const onLogout = useLogoutMutation();

  useEffect(() => {
    localStorage.removeItem("location");
    localStorage.removeItem("deviceCode");
  }, []);

  const onClickKasir = () => {
    router.push(`/${locale}/validate-toko`);
  };

  const onClickBackoffice = () => {
    router.push(`/${locale}/backoffice/dashboard`);
  };

  const onClickLogOut = () => {
    onLogout.mutate(undefined, {
      onSuccess: () => {
        signOut();
        localStorage.clear();
        sessionStorage.clear();
      },
      onError: () => {
        signOut();
        localStorage.clear();
        sessionStorage.clear();
      },
    });
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute pt-20 px-4 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        
        {/* Logo Brand dengan unoptimized */}
        <div className="flex justify-center mb-3">
          <Image
            src={`/images/${logoName}`}
            alt={brandName}
            width={50}
            height={50}
            className="object-contain"
            unoptimized
            priority
          />
        </div>

        <div className="font-semibold text-center text-xl md:text-3xl mb-4">
          Selamat datang di {brandName}
        </div>

        <div className="text-xs text-gray-500 text-center mb-8 md:text-base md:mb-10">
          Silakan pilih akses di bawah ini. Setiap akses memberikan informasi dan fitur yang berbeda untuk memenuhi kebutuhan Anda.
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10">
          <button onClick={onClickKasir}>
            <div className="w-[200px] md:w-[250px] border border-primary p-5 rounded-lg text-center hover:bg-slate-50 transition-colors">
              <Image
                src="/images/kasir.svg"
                width={250}
                height={250}
                alt="Gambar Kasir"
                className="mx-auto"
                unoptimized
              />
              <h1 className="text-lg md:text-2xl md:mt-6 mb-2 font-semibold text-primary">
                Kasir
              </h1>
              <p className="text-gray-600 text-xs md:text-base">
                Mengelola transaksi, menerima pembayaran, dan memastikan setiap transaksi
              </p>
            </div>
          </button>
          
          <button onClick={onClickBackoffice}>
            <div className="w-[200px] md:w-[250px] border border-primary p-5 rounded-lg text-center hover:bg-slate-50 transition-colors">
              <Image
                src="/images/backoffice.svg"
                width={250}
                height={250}
                alt="Gambar Backoffice"
                className="mx-auto"
                unoptimized
              />
              <h1 className="text-lg md:text-2xl md:mt-6 mb-2 font-semibold text-primary">
                Backoffice
              </h1>
              <p className="text-gray-600 text-xs md:text-base">
                Mengelola operasional internal, keperluan administrasi, dan sistem perusahaan
              </p>
            </div>
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center text-gray-500 gap-4 md:gap-10 my-8">
          <p className="text-center text-xs md:text-base md:text-left">
            Akhiri sesi untuk akun saat ini,{" "}
            <span
              className="text-primary font-semibold underline cursor-pointer"
              onClick={onClickLogOut}
            >
              Keluar
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValidationsRolesPage;