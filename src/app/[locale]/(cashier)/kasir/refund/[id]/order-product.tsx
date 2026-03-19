import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { SaleTransactionDetail } from "@/types/invoice";
import { FC } from "react";

interface ProdukProps {
    product: SaleTransactionDetail,
    handleRefund: (id: number) => void
}

 
const ProdukOrder: FC<ProdukProps> = ({
    product,
    handleRefund
}) => {
    return (
        <div className="flex justify-between items-center mt-4" key={product.id}>
            <div>
                <p className="text-xs md:text-sm">{product?.product_name}</p>
                <p className="text-xs md:text-sm text-slate-500">{formatRupiah(product.sell_price as number)} {product?.product_code}</p>
            </div>
            <div className="flex gap-2 text-xs md:text-sm">
                <div className="border-2 rounded-lg w-10 flex justify-center items-center">
                    <p>{ product?.quantity - product?.cancelled_quantity }</p>
                </div>
                <Button
                    type="button"
                    className="border-b-1 bg-blue-300 hover:bg-blue-500 border-primary"
                    onClick={() => handleRefund(product.id as number)}
                >
                    -
                </Button>
            </div>
        </div>
    );
}

export default ProdukOrder;
