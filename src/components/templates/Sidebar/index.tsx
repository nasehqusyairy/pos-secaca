"use client";

import React, { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import MenuButton from "@/components/atoms/MenuButton";

import { GoHome, GoPeople } from "react-icons/go";
import { FaRegChartBar } from "react-icons/fa";
import { CiBarcode, CiBoxes } from "react-icons/ci";
import { MdOutlineQueryStats } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { RiUserSettingsLine } from "react-icons/ri";
import { GrSystem } from "react-icons/gr";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

type MenuState = {
  [key: string]: {
    isOpen: boolean;
  };
};

// Main Sidebar component
function Sidebar() {
  const session = useSession();
  const t = useTranslations();
  const locale = useLocale();

  // Variable
  const entityName = session?.data?.user?.selected_entity?.name

  const [openMenu, setOpenMenu] = useState<MenuState>({
    laporan: { isOpen: false },
    "laporan-penjualan": { isOpen: false },
    "laporan-stock": { isOpen: false },
    "laporan-employee": { isOpen: false },
    produk: { isOpen: false },
    stock: { isOpen: false },
    "mengelola-produk": { isOpen: false },
    "mengelola-stok": { isOpen: false },
    people: { isOpen: false },
    pelanggan: { isOpen: false },
    "revenue-center": { isOpen: false },
    penjualan: { isOpen: false },
    administrasi: { isOpen: false },
    sistem: { isOpen: false },
    pos: { isOpen: false },
    konfigurasi: { isOpen: false },
  });

  const [openSideBar, setOpenSideBar] = useState<boolean>(false)
  const [sideBarStyle, setSideBarStyle] = useState<string>('')

  const router = useRouter();
  const pathname = usePathname();
  const lastPathname = pathname.split("/").pop() || "";
  const activeMenuClass = "bg-blue-500 text-white font-semibold";

  useEffect(() => {
    const menuKey = pathname.split("/");

    // Open the menu based on the current path
    setOpenMenu((prev) => {
      const newMenu = { ...prev };
      Object.keys(newMenu).forEach((key) => {
        newMenu[key].isOpen = menuKey.includes(key);
      });

      return newMenu;
    });
  }, [pathname]);

  // Handle toggle logic for menus
  const handleMenu = (menu: keyof typeof openMenu) => {
    setOpenMenu({
      ...openMenu,
      [menu]: {
        isOpen: !openMenu[menu].isOpen,
      },
    });
  };

  // Handle button click for specific actions
  const handleButtonClick = (url: string, toCashier = false) => {
    if (toCashier) {
      router.push(`/${locale}/cashier/keranjang`);
      return;
    }

    setOpenSideBar(false)
    router.push(`/${locale}/backoffice/${url}`);
  };

  const renderSubMenu = (
    menuKey: keyof typeof openMenu,
    subItems: { label: string; pathname: string; onClick?: () => void }[]
  ) => (
    <ul
      className={`${openMenu[menuKey].isOpen ? "" : "hidden"
        } py-2 space-y-2 ms-4`}
    >
      {subItems.map((item, index) => (
        <li key={index}>
          <Button
            variant={"ghost"}
            className={`${lastPathname.toLowerCase() == item.pathname.toLowerCase() &&
              activeMenuClass
              } w-full justify-start hover:text-primary`}
            onClick={item.onClick}
          >
            {item.label}
          </Button>
        </li>
      ))}
    </ul>
  );

  const toggleSideBar = () => {
    const newOpenSideBar = !openSideBar
    setOpenSideBar(newOpenSideBar)
  }

  useEffect(() => {
    if (!openSideBar) {
      setSideBarStyle('fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0')
    } else {
      setSideBarStyle('fixed top-0 left-0 z-40 w-64 h-screen transition-transform sm:translate-x-0')
    }
  }, [openSideBar])

  return (
    <>
      <button onClick={toggleSideBar} data-drawer-target="separator-sidebar" data-drawer-toggle="separator-sidebar" aria-controls="separator-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>
      <aside
        id="sidebar-multi-level-sidebar"
        className={sideBarStyle}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2 flex justify-between">
              <h2 className="mb-2 px-2 text-lg font-semibold">{entityName}</h2>
              <button onClick={toggleSideBar} data-drawer-target="separator-sidebar" data-drawer-toggle="separator-sidebar" aria-controls="separator-sidebar" type="button" className="inline-flex items-center px-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
            </div>
          </div>

          <ul className="space-y-2 font-medium">
            <li>
              <Button
                variant={"ghost"}
                className={`${lastPathname.toLowerCase() == "dashboard" && activeMenuClass
                  } w-full justify-start hover:text-primary`}
                onClick={() => handleButtonClick("/dashboard")}
              >
                <GoHome className="mr-2" />
                {t("dashboard")}
              </Button>
            </li>
            {/* <li>
            <Button
              variant={"ghost"}
              className={`w-full justify-start hover:text-primary`}
              onClick={() => handleButtonClick("", true)}
            >
              <BsShop className="mr-2" />
              {t("kasir")}
            </Button>
          </li> */}
            <li>
              <MenuButton
                label={t("laporan")}
                icon={<FaRegChartBar className="mr-2" />}
                isOpen={openMenu["laporan"].isOpen}
                onClick={() => handleMenu("laporan")}
              />
              <ul
                className={`${openMenu.laporan.isOpen ? "" : "hidden"
                  } py-2 space-y-2 ms-4`}
              >
                <li>
                  <MenuButton
                    label={t("laporanPenjualan")}
                    icon={<></>}
                    isOpen={openMenu["laporan-penjualan"].isOpen}
                    onClick={() => handleMenu("laporan-penjualan")}
                  />
                  {renderSubMenu("laporan-penjualan", [
                    {
                      label: t("laporanPenjualan"),
                      pathname: "laporan-penjualan",
                      onClick: () => handleButtonClick("laporan/laporan-penjualan/laporan-penjualan-summary"),
                    },
                    {
                      label: t("report_sales_by_product"),
                      pathname: "laporan-penjualan-by-product",
                      onClick: () => handleButtonClick("laporan/laporan-penjualan/laporan-penjualan-by-product"),
                    },
                    {
                      label: t("laporanPenjualanByToko"),
                      pathname: "laporan-penjualan-toko",
                      onClick: () => handleButtonClick("laporan/laporan-penjualan/laporan-penjualan-toko"),
                    },
                  ])}
                </li>
                <li>
                  <MenuButton
                    label={t("laporanStock")}
                    icon={<></>}
                    isOpen={openMenu["laporan-stock"].isOpen}
                    onClick={() => handleMenu("laporan-stock")}
                  />
                  {renderSubMenu("laporan-stock", [
                    {
                      label: t("laporanKartuStok"),
                      pathname: "laporan-stok-card",
                      onClick: () =>
                        handleButtonClick("laporan/laporan-stock/laporan-stok-card"),
                    },
                    {
                      label: t("laporanPergerakanStok"),
                      pathname: "laporan-penjualan-stok",
                      onClick: () =>
                        handleButtonClick("laporan/laporan-stock/laporan-penjualan-stok"),
                    },
                  ])}
                </li>
                <li>
                  <MenuButton
                    label={t("laporanEmployee")}
                    icon={<></>}
                    isOpen={openMenu["laporan-employee"].isOpen}
                    onClick={() => handleMenu("laporan-employee")}
                  />
                  {renderSubMenu("laporan-employee", [
                    {
                      label: t("laporanEmployeeSummary"),
                      pathname: "laporan-employee-summary",
                      onClick: () =>
                        handleButtonClick("laporan/laporan-employee/laporan-employee-summary"),
                    },
                    {
                      label: t("laporanEmployeeDetail"),
                      pathname: "laporan-employee-detail",
                      onClick: () =>
                        handleButtonClick("laporan/laporan-employee/laporan-employee-detail"),
                    },
                  ])}
                </li>
              </ul>
            </li>
            {/* <li>
            <MenuButton
              label={t("laporan")}
              icon={<FaRegChartBar className="mr-2" />}
              isOpen={openMenu.laporan.isOpen}
              onClick={() => handleMenu("laporan")}
            />
            {renderSubMenu("laporan", [
              
              {
                label: t("laporanEmployeeSummary"),
                pathname: "laporan-employee-summary",
                onClick: () =>
                  handleButtonClick("laporan/laporan-employee-summary"),
              },
            ])}
          </li> */}

            <li>
              <MenuButton
                label={t("produk")}
                icon={<CiBarcode className="mr-2" />}
                isOpen={openMenu.produk.isOpen}
                onClick={() => handleMenu("produk")}
              />
              <ul
                className={`${openMenu.produk.isOpen ? "" : "hidden"
                  } py-2 space-y-2 ms-4`}
              >
                {/* <li>
                <MenuButton
                  label={t("mengelolaProduk")}
                  icon={<></>}
                  isOpen={openMenu["mengelola-produk"].isOpen}
                  onClick={() => handleMenu("mengelola-produk")}
                />
                {renderSubMenu("mengelola-produk", [
                  {
                    label: t("mengelolaProdukUnit"),
                    pathname: "produk-unit",
                    onClick: () =>
                      handleButtonClick("produk/mengelola-produk/produk-unit"),
                  },
                  {
                    label: t("mengelolaProdukKategori"),
                    pathname: "produk-kategori",
                    onClick: () =>
                      handleButtonClick(
                        "produk/mengelola-produk/produk-kategori"
                      ),
                  },
                ])}
              </li> */}
                <li>
                  <Button
                    variant={"ghost"}
                    className={`${lastPathname.toLowerCase() == "mengelola-produk" &&
                      activeMenuClass
                      } w-full justify-start hover:text-primary`}
                    onClick={() => handleButtonClick("produk/mengelola-produk")}
                  >
                    {t("mengelolaProduk")}
                  </Button>
                </li>
                <li>
                  <Button
                    variant={"ghost"}
                    className={`${lastPathname.toLowerCase() == "mengelola-produk-kategori" &&
                      activeMenuClass
                      } w-full justify-start hover:text-primary`}
                    onClick={() =>
                      handleButtonClick("produk/mengelola-produk-kategori")
                    }
                  >
                    {t("mengelolaProdukKategori")}
                  </Button>
                </li>
                <li>
                  <Button
                    variant={"ghost"}
                    className={`${lastPathname.toLowerCase() == "mengelola-produk-unit" &&
                      activeMenuClass
                      } w-full justify-start hover:text-primary`}
                    onClick={() =>
                      handleButtonClick("produk/mengelola-produk-unit")
                    }
                  >
                    {t("mengelolaProdukUnit")}
                  </Button>
                </li>
                {/* <li>
                  <Button
                    variant={"ghost"}
                    className={`${lastPathname.toLowerCase() == "mengelola-stok" &&
                      activeMenuClass
                      } w-full justify-start hover:text-primary`}
                    onClick={() => handleButtonClick("produk/mengelola-stok")}
                  >
                    {t("mengelolaStok")}
                  </Button>
                </li> */}
                {/* <li>
                <MenuButton
                  label={t("mengelolaStok")}
                  icon={<></>}
                  isOpen={openMenu["mengelola-stok"].isOpen}
                  onClick={() => handleMenu("mengelola-stok")}
                />
                {renderSubMenu("mengelola-stok", [
                  {
                    label: t("stokOpname"),
                    pathname: "stok",
                    onClick: () =>
                      handleButtonClick("produk/mengelola-stok/stok"),
                  },
                ])}
              </li>
              <li>
                <Button
                  variant={"ghost"}
                  className={`${
                    lastPathname.toLowerCase() == "import-produk" &&
                    activeMenuClass
                  } w-full justify-start hover:text-primary`}
                  onClick={() => handleButtonClick("produk/import-produk")}
                >
                  {t("importProduk")}
                </Button>
              </li> */}
              </ul>
            </li>

            <li>
              <MenuButton
                label='Stok'
                icon={<CiBoxes className="mr-2" />}
                isOpen={openMenu.stock.isOpen}
                onClick={() => handleMenu("stock")}
              />
              <ul
                className={`${
                  openMenu.stock.isOpen ? "" : "hidden"
                } py-2 space-y-2 ms-4`}
              >
                <li>
                  <Button
                    variant={"ghost"}
                    className={`${
                      lastPathname.toLowerCase() == "stock-opname" &&
                      activeMenuClass
                    } w-full justify-start hover:text-primary`}
                    onClick={() => handleButtonClick("stock/stock-opname")}
                  >
                    Stok Opname
                  </Button>
                </li>
                <li>
                  <Button
                    variant={"ghost"}
                    className={`${
                      lastPathname.toLowerCase() == "stock-transfer" &&
                      activeMenuClass
                    } w-full justify-start hover:text-primary`}
                    onClick={() => handleButtonClick("stock/stock-transfer")}
                  >
                    Pindah Stok
                  </Button>
                </li>
                <li>
                  <Button
                    variant={"ghost"}
                    className={`${
                      lastPathname.toLowerCase() == "stock-adjustment" &&
                      activeMenuClass
                    } w-full justify-start hover:text-primary`}
                    onClick={() => handleButtonClick("stock/stock-adjustment")}
                  >
                    Penyesuaian Stok
                  </Button>
                </li>
              </ul>
            </li>

            <li>
              <MenuButton
                label={t("people")}
                icon={<GoPeople className="mr-2" />}
                isOpen={openMenu["people"].isOpen}
                onClick={() => handleMenu("people")}
              />
              <ul
                className={`${openMenu.people.isOpen ? "" : "hidden"
                  } py-2 space-y-2 ms-4`}
              >
                <li>
                  <MenuButton
                    label={t("pelanggan")}
                    icon={<></>}
                    isOpen={openMenu["pelanggan"].isOpen}
                    onClick={() => handleMenu("pelanggan")}
                  />
                  {renderSubMenu("pelanggan", [
                    {
                      label: t("loyalty"),
                      pathname: "loyalty",
                      onClick: () =>
                        handleButtonClick("people/pelanggan/loyalty"),
                    },
                    {
                      label: t("kategoriPelanggan"),
                      pathname: "kategori-pelanggan",
                      onClick: () =>
                        handleButtonClick("people/pelanggan/kategori-pelanggan"),
                    },
                  ])}
                </li>
                {/* <li>
                <Button
                  variant={"ghost"}
                  className={`${
                    lastPathname.toLowerCase() == "supplier" && activeMenuClass
                  } w-full justify-start hover:text-primary`}
                  onClick={() => handleButtonClick("people/supplier")}
                >
                  {t("supplier")}
                </Button>
              </li> */}
              </ul>
            </li>

            <li>
              <MenuButton
                label={t("revenueCenter")}
                icon={<MdOutlineQueryStats className="mr-2" />}
                isOpen={openMenu["revenue-center"].isOpen}
                onClick={() => handleMenu("revenue-center")}
              />
              <ul
                className={`${openMenu["revenue-center"].isOpen ? "" : "hidden"
                  } py-2 space-y-2 ms-4`}
              >
                <li>
                  <MenuButton
                    label={t("penjualan")}
                    icon={<></>}
                    isOpen={openMenu.penjualan.isOpen}
                    onClick={() => handleMenu("penjualan")}
                  />
                  {renderSubMenu("penjualan", [
                    {
                      label: t("rekapan"),
                      pathname: "rekapan-penjualan",
                      onClick: () =>
                        handleButtonClick(
                          "revenue-center/penjualan/rekapan-penjualan"
                        ),
                    },
                    {
                      label: t("daftarPenjualan"),
                      pathname: "daftar-penjualan",
                      onClick: () =>
                        handleButtonClick(
                          "revenue-center/penjualan/daftar-penjualan"
                        ),
                    },
                  ])}
                </li>
                <li>
                  <Button
                    variant={"ghost"}
                    className={`${lastPathname.toLowerCase() == "promosi" && activeMenuClass
                      }  w-full justify-start hover:text-primary`}
                    onClick={() => handleButtonClick("revenue-center/promosi")}
                  >
                    {t("promosi")}
                  </Button>
                </li>
              </ul>
            </li>
            <li>
              <MenuButton
                label={t("administrasi")}
                icon={<IoSettingsOutline className="mr-2" />}
                isOpen={openMenu["administrasi"].isOpen}
                onClick={() => handleMenu("administrasi")}
              />
              {renderSubMenu("administrasi", [
                {
                  label: t("entity"),
                  pathname: "entity",
                  onClick: () => handleButtonClick("administrasi/entity"),
                },
                // { label: t('brand'), pathname: 'brand', onClick: () => handleButtonClick("administrasi/brand") },
                {
                  label: t("lokasi"),
                  pathname: "lokasi",
                  onClick: () => handleButtonClick("administrasi/lokasi"),
                },
                {
                  label: t("karyawan"),
                  pathname: "karyawan",
                  onClick: () => handleButtonClick("administrasi/karyawan"),
                },
                {
                  label: t("role"),
                  pathname: "role",
                  onClick: () => handleButtonClick("administrasi/role"),
                },
              ])}
            </li>
          </ul>

          <div className="space-y-4 pt-4">
            <div className="px-3 py-2">
              <p className="text-md">{t("pengaturan")}</p>
            </div>
          </div>

          <ul className="font-medium">
            <li>
              <MenuButton
                label={t("sistem")}
                icon={<GrSystem className="mr-2" />}
                isOpen={openMenu["sistem"].isOpen}
                onClick={() => handleMenu("sistem")}
              />
              {renderSubMenu("sistem", [
                {
                  label: t("metodePembayaran"),
                  pathname: "metode-pembayaran",
                  onClick: () => handleButtonClick("sistem/metode-pembayaran"),
                },
                {
                  label: t("pajak"),
                  pathname: "pajak",
                  onClick: () => handleButtonClick("sistem/pajak"),
                },
              ])}
            </li>
            {/* <li>
                <MenuButton
                label={t('pos')}
                icon={<MdOutlinePhonelink className="mr-2" />}
                isOpen={openMenu.pos.isOpen}
                onClick={() => handleMenu("pos")}
                />
                {renderSubMenu("pos", [
                { label: t('mengelolaKatalog'), onClick: () => handleButtonClick("Manage Katalog") },
                ])}
            </li> */}
            <li>
              <MenuButton
                label={t("konfigurasi")}
                icon={<RiUserSettingsLine className="mr-2" />}
                isOpen={openMenu["konfigurasi"].isOpen}
                onClick={() => handleMenu("konfigurasi")}
              />
              {renderSubMenu("konfigurasi", [
                {
                  label: t("orderType"),
                  pathname: "order-type",
                  onClick: () => handleButtonClick("konfigurasi/order-type"),
                },
                // {
                //   label: t("customInvoiceNumber"),
                //   pathname: "custom-invoice",
                //   onClick: () => handleButtonClick("konfigurasi/custom-invoice"),
                // },
              ])}
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
