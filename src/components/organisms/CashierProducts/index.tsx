import React, { FC, useEffect } from "react";
import ProductCard from "@/components/molecules/ProductCard";
import { Catalogues } from "@/app/api/catalogues/type";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CashierDisplayProps {
  data: any;
  flagAutoAssignProduct: boolean,
  onToggleProduct: (product: Catalogues) => void;
  selectedProduct: Catalogues[];
}

const CashierDisplay: FC<CashierDisplayProps> = ({
  data,
  flagAutoAssignProduct,
  onToggleProduct,
  selectedProduct,
}) => {
  const idSet = new Set(selectedProduct?.map((item) => item.id));

  return (
    <section className="mt-5 grid grid-cols-2 gap-2 md:flex md:gap-2 2xl:gap-4 flex-wrap text-xs md:text-base">
      {data?.map((val: Catalogues) => {
        return (
          <ProductCard
            selectedProduct={selectedProduct}
            isSelected={idSet.has(val?.id)}
            onToggleProduct={onToggleProduct}
            key={val.id}
            product={val}
          />
        );
      })}
    </section>
  );
};

export default CashierDisplay;
