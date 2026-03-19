import { Catalogues } from "@/app/api/catalogues/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatRupiah = (value: number, useCurrency: boolean = false, showAfterComma: boolean = false) => {
  if (value == null || !value) value = 0;

  const builder = []
  if (useCurrency) builder.push("Rp. ")
  builder.push(new Intl.NumberFormat("id-ID").format(value))
  if (showAfterComma) builder.push(",-")

  return builder.join('')
};

export const getProductPrice = (
  product?: Catalogues,
  orderId?: number,
  IDRFormat = true
) => {
  const sellPrice =
    product?.product_sell_prices?.find((x: any) => x.order_type_id == orderId)
      ?.sell_price ?? product?.sell_price;

  if (!IDRFormat) return sellPrice ?? 0;

  return formatRupiah(sellPrice as number) ?? null;
};

export const getProductStock = (
  product?: Catalogues,
) => {
  if (!product || !product.product_location_stock) {
    return 0
  }

  return product.product_location_stock.stock
}

export const localeFormatDate = () => {
  const currentDate = new Date();

  const formatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "short",
    day: "numeric",
  });


  return formatter.format(currentDate);
};

export const defaultFormatter = Intl.DateTimeFormat("id-ID", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

export const formatterWithTime = Intl.DateTimeFormat("id-ID", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatterOnlyDate = Intl.DateTimeFormat("id-ID", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const formatDate = (date: Date, formatter: Intl.DateTimeFormat = defaultFormatter) => {
  return formatter.format(date);
}

export function getPersenDiskon(diskon: number, total: number) {
  return diskon * 100 / total
}