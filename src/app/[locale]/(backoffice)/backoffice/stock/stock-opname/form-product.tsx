"use client"

import { Button } from "@/components/ui/button";
import { FC, useEffect, useRef, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useGetProductByBarcodeQuery } from "@/app/api/product/queries";
import { getProductStockOne } from "@/app/api/product/api";
import { ProductAdjustmentStockDetail } from "@/app/api/product/type";
import { ProductOpnameResponse } from "@/app/api/product/product-opname/type";

const ProductStockOpnameColumns = [
    "No Urut", "Barcode", "Nama Produk", "Kategori",
    "Harga Jual", "Stok", "Terhitung", "Perbedaan",
    "Total"
];

interface FieldProductProps {
    data?: ProductOpnameResponse | null,
    form: any;
    disabled: boolean;
    preview_page?: number;
    location_id: number,
}

const FieldProduct: FC<FieldProductProps> = ({
    data,
    form,
    disabled,
    preview_page,
    location_id
}) => {
    const [values, setValues] = useState<ProductAdjustmentStockDetail[]>([])
    const [searchValue, setSearchValue] = useState('');
    const [storedProducts, setStoredProducts] = useState<any[]>([]);

    const inputSearchValueRef = useRef<HTMLInputElement>(null);
    const errorSearch = useRef<HTMLParagraphElement>(null)

    const {data: dataProduct, isFetching: isFetchingProduct, refetch} = useGetProductByBarcodeQuery(1, searchValue)

    useEffect(() => { calculateRecordedStock() }, [location_id]);

    useEffect(() => {
        if (isFetchingProduct) return

        if(dataProduct?.data) {
            const product = dataProduct.data[0]
            if (!product) {
                if(errorSearch.current) errorSearch.current.innerHTML = "Produk tidak ditemukan"
                if(inputSearchValueRef.current) inputSearchValueRef.current.value = ""
                setSearchValue('')

                return
            } else if (errorSearch.current) {
                errorSearch.current.innerHTML = ""
            }

            // check product is exist in list
            const isExistFromValues = values.find((data: ProductAdjustmentStockDetail) => data.product_id == product.id)
            if(isExistFromValues) {
                const newValue = values.map(data => {
                    if (data.product_id == isExistFromValues.product_id) {
                        data.counted_stock = data.counted_stock + 1;
                        data.difference_stock = calculateDifferenceStock(data.recorded_stock, data.counted_stock);
                    }

                    return data;
                })

                setValues(newValue)
                form.setValue("products", newValue);
            } else {
                addNewValues(product)
            }
        } else {
            if(errorSearch.current) errorSearch.current.innerHTML = "Produk tidak ditemukan"
            // setEditingRowId("");
        }

        setSearchValue('')
        if(errorSearch.current) errorSearch.current.innerHTML = ""
        if(inputSearchValueRef.current) {
            inputSearchValueRef.current.value = ""
            inputSearchValueRef.current.focus()
        }
    }, [isFetchingProduct]);

    const handleDelete = (index: number, product_id: number) => {
        const newValues = values.filter((_, i) => i !== index);
        setValues(newValues);

        form.setValue("products", newValues);
    }

    const addNewValues = async (product: any) => {
        setStoredProducts((prev) => [...prev, product])

        const dataProductStock = await getProductStockOne({
            product: Number(product.id),
            product_unit: Number(product.product_unit_id),
            location: location_id
        });

        const recorded_stock = dataProductStock.data?.stock || 0
        const counted_stock = 1
        const difference_stock = calculateDifferenceStock(recorded_stock, counted_stock)

        const newRow: ProductAdjustmentStockDetail = {
            id: null,
            product_id: product.id,
            product_unit_id: product.product_unit_id,
            product_category_id: product.product_category_id,
            recorded_stock: +recorded_stock,
            counted_stock: +counted_stock,
            difference_stock,
            note: null,
        }

        const newValues = [...values, newRow]
        form.setValue("products", newValues);
        
        setValues(newValues)
    }

    const calculateRecordedStock = () => {
        if (values.length == 0) return

        values.forEach(async value => {
            const dataProductStock = await getProductStockOne({
                product: Number(value.product_id),
                product_unit: Number(value.product_unit_id),
                location: location_id
            });

            setValues(prev => {
                const newValue = prev.map(data => {
                    if (data.product_id == value.product_id) {
                        data.recorded_stock = dataProductStock.data?.stock || 0;
                        data.difference_stock = calculateDifferenceStock(data.recorded_stock, data.counted_stock);
                    }

                    return data;
                })

                return newValue;
            })
        });
    }

    const calculateDifferenceStock = (recorded_stock: number, counted_stock: number) => {
        return counted_stock - recorded_stock
    }

    const handleKeyDownSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key == 'Enter') {
        event.preventDefault();
        
        if (inputSearchValueRef && inputSearchValueRef.current) {
            setSearchValue(inputSearchValueRef.current.value)
        }
      }
    }

    useEffect(() => {
        form.setValue("products", []);
        setValues([])
        setStoredProducts([])
        setSearchValue('')

        if (!data || !data.product_opname_service_details) return

        const values: any[] = []
        const products: any[] = []
        data.product_opname_service_details.forEach((detail) => {
            values.push({
                id: detail.id,
                product_id: detail.product_id,
                product_unit_id: detail.product_unit_id,
                product_category_id: detail.product_category_id,
                recorded_stock: detail.recorded_stock,
                counted_stock: detail.counted_stock,
                difference_stock: detail.difference_stock,
            })

            products.push(detail.product)
        })

        setValues(values)
        setStoredProducts(products)
        setSearchValue('')
        form.setValue("products", values)
    }, [data]);

    return (
        <div>
            <FormLabel className="block">Products</FormLabel>
            {
                !disabled && <div className="mt-4">
                    <Input
                        placeholder="Cari produk berdasarkan barcode"
                        className="w-full"
                        ref={inputSearchValueRef}
                        onKeyDown={handleKeyDownSearch}
                        // onKeyDown={(event) => event.preventDefault()}
                        type="input"
                        disabled={location_id === 0 || isFetchingProduct}
                    />
                    <p className="text-xs mt-1">
                        Tekan Enter untuk mencari
                    </p>
                </div>
            }
            { !disabled && <p ref={errorSearch} className="text-sm mt-2"></p> }
            <Table className="border rounded-xl mt-4">
                <TableHeader>
                    <TableRow>
                        {ProductStockOpnameColumns.map(
                            (item: string, i: number) => (
                                <TableHead key={item + i}>{item}</TableHead>
                            )
                        )}
                        { !disabled && <TableHead>Action</TableHead> }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {values.map((item: ProductAdjustmentStockDetail, i: number) => {
                        const product = storedProducts.find((product) => product.id == item.product_id);

                        return (
                            <TableRow key={i}>
                                <TableCell>{(preview_page || 0) + i + 1}</TableCell>
                                <TableCell>{product?.barcode}</TableCell>
                                <TableCell>{product?.name}</TableCell>
                                <TableCell>{product?.product_category?.name}</TableCell>
                                <TableCell>{formatRupiah(parseInt(product?.sell_price ?? '0'))}</TableCell>
                                <TableCell>{item.recorded_stock}</TableCell>
                                <TableCell>{item.counted_stock}</TableCell>
                                <TableCell>{item.difference_stock}</TableCell>
                                <TableCell>{formatRupiah(parseInt(product?.sell_price ?? '0') * item.difference_stock)}</TableCell>
                                { 
                                    !disabled && <TableCell className={cn("w-[100px]")}>
                                        <Button size="icon" variant="outline" type="button" onClick={() => handleDelete(i, product?.id || 0)}>
                                            <Trash className="w-4 h-4" style={{ color: 'red' }} />
                                        </Button>
                                    </TableCell>
                                }
                            </TableRow>
                        )
                    }
                    )}
                </TableBody>
            </Table>

            <FormField
                control={form.control}
                name="products"
                render={({ field }) => (
                    <FormItem>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export default FieldProduct;