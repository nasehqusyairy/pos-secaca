import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatRupiah, getProductPrice, getProductStock } from "@/lib/utils";
import { Catalogues } from "@/app/api/catalogues/type";

interface ProductQuantityProps {
  product: Catalogues;
  onQuantityUpdate: (productId: number, newQuantity: number) => void;
  addDiskonProduct: (product: Catalogues) => void;
  deleteDiskonProduct: (product: Catalogues) => void;
  orderType: number;
}

const ProductQuantity: FC<ProductQuantityProps> = ({
  product,
  onQuantityUpdate,
  addDiskonProduct,
  deleteDiskonProduct,
  orderType
}) => {
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  const increment = () => {
    onQuantityUpdate(product.id, product.quantity + 1);
  };

  const decrement = () => {
    onQuantityUpdate(product.id, product.quantity - 1);
  };

  useEffect(() => {
    const newPrice = getProductPrice(product, orderType, false);
    setPrice(newPrice as number);

    setStock(getProductStock(product) as number)
  }, [product, orderType]);

  const diskon = product?.adjustment?.discountAmount ?? 0;
  const surchargeAmount = product?.adjustment?.surchargeAmount ?? 0;

  return (
    <section>
      <div className="text-sm md:text-base font-semibold md:mt-1 flex gap-2 justify-between">
        <p className="font-semibold">{product?.name}</p>
        <p className="text-slate-400 text-xs">{formatRupiah(price)} - Stok: {stock}</p>
      </div>
      <div className="mt-1 flex justify-between items-center">
        {/* <div className="text-sm md:text-base flex gap-2 items-end"> */}
          {/* <p className="text-slate-500 text-sm">{formatRupiah(price)}</p> */}
          {/* <p>{diskon !== 0 && formatRupiah(price - diskon)}</p> */}
        {/* </div> */}
        <div className="flex gap-2">
          <Button
            type="button"
            size={"sm"}
            // className="border-b-1 bg-blue-300 hover:bg-blue-500 border-primary active:bg-blue-300"
            className="text-xs md:text-xs btn-sm button-small"
            onClick={decrement}
          >
            -
          </Button>
          <div className="text-xs md:text-base border-2 rounded-lg w-9 flex justify-center items-center">
            <p>{product.quantity}</p>
          </div>
          <Button
            type="button"
            disabled={product.quantity >= stock}
            size={"sm"}
            // className="border-b-1 bg-blue-300 hover:bg-blue-500 border-primary active:bg-blue-300"
            className="text-xs md:text-xs"
            onClick={increment}
          >
            +
          </Button>
        </div>
        <div>
          <p className="font-bold text-right text-sm md:text-lg">
            {formatRupiah((price - diskon + surchargeAmount) * product.quantity)}
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-1">
        <div className="flex">
          <p className="text-xs text-primary cursor-pointer" onClick={() => addDiskonProduct(product)}>Tambah diskon</p>
          {diskon === 0 && surchargeAmount === 0 ? <></> : <p className="text-xs text-primary cursor-pointer ml-2 text-red" onClick={() => deleteDiskonProduct(product)}>Hapus diskon</p>}
        </div>

        {surchargeAmount !== 0 && (<p className="text-xs mb-2">Biaya tambahan : {surchargeAmount !== 0 && formatRupiah(surchargeAmount)}</p>)}
        {diskon !== 0 && (<p className="text-xs mb-2 text-slate-400">Diskon : {diskon !== 0 && formatRupiah(diskon)}</p>)}
      </div>
      <Separator className="my-4" />
    </section>
  );
};

export default ProductQuantity;
