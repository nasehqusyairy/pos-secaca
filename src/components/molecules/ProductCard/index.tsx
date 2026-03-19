import React, { FC, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Catalogues } from "@/app/api/catalogues/type";
import { getProductPrice, getProductStock } from "@/lib/utils";
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Catalogues;
  selectedProduct: Catalogues[];
  onToggleProduct: (product: Catalogues) => void;
  isSelected: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  product,
  selectedProduct,
  onToggleProduct,
  isSelected,
}) => {
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    setStock(getProductStock(product) as number)
  }, [])

  return (
    <Card
      className={`w-full md:w-[200px] active:bg-blue-100 cursor-pointer`}
      onClick={() => onToggleProduct(product)}
    >
      <CardContent className="pt-2 p-2">
        {/* <div className="w-full h-[120px] p-2 flex justify-center items-center">
          <IoFastFoodOutline size={52} className="text-slate-200" />
        </div> */}

        <div className="p-2">
          <p className="text-slate-600 font-semibold">{product?.name}</p>
          <p className="text-slate-400 text-xs mb-2">
            {product?.barcode}
          </p>
          <div className="flex justify-between items-center">
            <p className="font-semibold">{getProductPrice(product)} </p>
            <p className="text-slate-400 font-semibold text-xs">{stock} </p>
            {/* {
              !isSelected && (
                  <Button
                  className="rounded-full bg-teal-600 hover:bg-teal-700"
                  size="icon"
                >
                  +
                </Button>
              )
            } */}
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
