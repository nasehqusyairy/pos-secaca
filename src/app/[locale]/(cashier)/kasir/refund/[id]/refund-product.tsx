import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { SaleTransactionDetail } from "@/types/invoice";
import { FC } from "react";

interface RefundItemProps {
    product: SaleTransactionDetail,
    products: SaleTransactionDetail[],
    handleRefund: (id: number) => void
    handleBackProduct: (id: number) => void
}

 
const RefundItem: FC<RefundItemProps> = ({
    product,
    products,
    handleRefund,
    handleBackProduct
}) => {
    const isDisabledAdd = products.find((p) => p.id === product.id) ? false : true;

    return (
        <div className="flex justify-between items-center mt-4" key={product.id}>
            <div>
                <p className="text-xs md:text-sm">{product?.product_name}</p>
                <p className="text-xs md:text-sm text-slate-500">{formatRupiah(product.sell_price as number)} {product?.product_code}</p>
            </div>
            <div className="flex gap-2">
                <Button
                        type="button"
                        className="border-b-1 bg-blue-300 hover:bg-blue-500 border-primary text-xs md:text-sm"
                        onClick={() => handleBackProduct(product.id as number)}
                    >
                    -
                </Button>
                <div className="border-2 rounded-lg w-10 flex justify-center items-center text-xs md:text-sm">
                    <p>{product?.quantity}</p>
                </div>
                <Button
                    type="button"
                    className="border-b-1 bg-blue-300 hover:bg-blue-500 border-primary text-xs md:text-sm"
                    onClick={() => handleRefund(product.id as number)}
                    disabled={isDisabledAdd}
                >
                    +
                </Button>
            </div>
        </div>
    );
}

export default RefundItem;