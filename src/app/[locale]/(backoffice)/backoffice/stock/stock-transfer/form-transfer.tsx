"use client"

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn, formatRupiah } from "@/lib/utils";
import { Pencil, Trash } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { IoMdAdd, IoMdClose, IoMdSave } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { ProductTransferDetail, TransferProduct } from "@/app/api/product/product-transfers/type";
import ProductDropdownSelectWithoutLoadMore from "@/components/templates/Dropdowns/product-dropdown-without-load-more";
import { ProductDropdown } from "@/types/dropdown";


const TransferProduct_COLUMNS = ["No Urut", "Nama", "Barcode", "Harga Jual", "Qty"];

interface FieldTransferProductProps {
    data?: TransferProduct,
    disabled: boolean,
    form: any;
}

const FieldTransferProduct: FC<FieldTransferProductProps> = ({
    data,
    disabled,
    form,
}) => {
    const inputQuantityRef = useRef<HTMLInputElement>(null);

    const [values, setValues] = useState<ProductTransferDetail[]>([])
    const [editingRowId, setEditingRowId] = useState<number | string | null>(null);
    const [product, setProduct] = useState<ProductDropdown | undefined>(undefined);
    const [selectedProducts, setSelectedProducts] = useState<ProductDropdown[]>([]);

    const handleSaveValue = () => {
        const quantity = inputQuantityRef.current?.value;
        if (!product || !quantity || +quantity <= 0) {
            return;
        }

        const newValue: any = [{
            product_id: +product.id,
            quantity: +quantity,
            line_amount: +quantity * parseInt(product.sell_price),
        }, ...values];

        setValues(newValue);

        form.setValue("products", newValue);

        setSelectedProducts((prev) => [...prev, product])

        // Reset value
        setProduct(undefined);
        inputQuantityRef.current.value = "";
        setEditingRowId(null);
    };

    const handleEdit = (item: ProductTransferDetail, product?: ProductDropdown) => {
        if (!product) return

        setEditingRowId("edit");
        handleDelete(product)
        setTimeout(() => {
            setProduct(product)
            if (inputQuantityRef.current) {
                inputQuantityRef.current.value = item.quantity.toString();
            }
        }, 100)
    }

    const handleDelete = (product?: ProductDropdown) => {
        if (!product) return

        const newValue = values.filter((value) => value.product_id !== product.id);
        setValues(newValue);

        form.setValue("products", newValue);

        const newSelectedProducts = selectedProducts.filter((selectedProduct) => selectedProduct.id !== product.id);
        setSelectedProducts(newSelectedProducts);
    }

    const onAdd = () => {
        setProduct(undefined);
        if (inputQuantityRef.current) {
            inputQuantityRef.current.value = '0';
        }
        setEditingRowId('tambah');
    }

    const onCancel = () => {
        if (editingRowId === 'edit') {
            const quantity = inputQuantityRef.current?.value;
            if (!product || !quantity || +quantity <= 0) {
                return;
            }

            handleSaveValue()
        }

        setEditingRowId(null);
    }

    useEffect(() => {
        if (!data || !data.product_transfer_service_details) return

        const values: any[] = []
        const products: any[] = []
        data.product_transfer_service_details.forEach((detail) => {
            values.push({
                id: detail.id,
                product_id: detail.product_id,
                quantity: detail.quantity,
                line_amount: detail.quantity * parseInt(detail.product?.sell_price || '0')
            })
            products.push(detail.product)
        })
        
        setValues(values)
        setSelectedProducts(products)
    }, [data]);

    const setValueTransferProducts = (data: any, form: any) => {
        const value = data && data.map((item: any) => {
            return {
                product_id: item.product_id,
                quantity: item.quantity
            }
        })

        form.setValue("products", value);
    }

    return (
        <div>
            <FormLabel className="block">Produk</FormLabel>
            {
                !disabled && <Button variant="secondary" className="ml-auto mt-4" onClick={() => onAdd()} type="button">
                    <IoMdAdd className="mr-2" /> Tambah Produk
                </Button>
            }

            <Table className="border rounded-xl mt-4">
                <TableHeader>
                    <TableRow>
                        {TransferProduct_COLUMNS.map(
                            (item: string, i: number) => (
                                <TableHead key={item + i}>{item}</TableHead>
                            )
                        )}
                        {
                            !disabled && <TableHead>Aksi</TableHead>
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        editingRowId !== null && (
                            <TableRow>
                                <TableCell>
                                    -
                                </TableCell>
                                <TableCell>
                                    <FormItem>
                                        <ProductDropdownSelectWithoutLoadMore
                                            full
                                            defaultExcludeIds={selectedProducts && selectedProducts.map((x: ProductDropdown) => x.id)}
                                            handleValueChange={setProduct}
                                            defaultValue={product}
                                            key="prod-1"
                                        />
                                    </FormItem>
                                </TableCell>
                                <TableCell>
                                    {product?.barcode || ''}
                                </TableCell>
                                <TableCell>
                                    {formatRupiah(parseInt(product?.sell_price || '0'))}
                                </TableCell>
                                <TableCell>
                                    <FormControl>
                                        <Input
                                            ref={inputQuantityRef}
                                            type="number"
                                            className="w-full"
                                            placeholder="Enter quantity"
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button onClick={handleSaveValue} type="button">
                                            <IoMdSave className="w-4 h-4" />
                                        </Button>
                                        <Button onClick={onCancel} variant="secondary" type="button">
                                            <IoMdClose className="w-4 h-4" style={{ color: 'red' }} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    }
                    {values.map((item: ProductTransferDetail, i: number) => {
                        const product = selectedProducts.find((product) => product.id == item.product_id);

                        return (
                            <TableRow key={i}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{product?.name}</TableCell>
                                <TableCell>{product?.barcode}</TableCell>
                                <TableCell>
                                    {formatRupiah(parseInt(product?.sell_price || '0'))}
                                </TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                {
                                    !disabled && <TableCell className={cn("w-[100px]")}>
                                        <div className="flex gap-1">
                                            <Button size="icon" variant="outline" onClick={() => handleEdit(item, product)} type="button">
                                                <Pencil className="w-4 h-4" style={{ color: 'green' }} />
                                            </Button>
                                            <Button size="icon" variant="outline" onClick={() => handleDelete(product)} type="button">
                                                <Trash className="w-4 h-4" style={{ color: 'red' }} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                }
                            </TableRow>
                        )
                    }
                    )}
                    {
                        values.length > 0 &&  <TableRow>
                            <TableCell>
                                &nbsp;
                            </TableCell>
                            <TableCell>
                                &nbsp;
                            </TableCell>
                            <TableCell>
                                &nbsp;
                            </TableCell>
                            <TableCell>
                                Total Kuantitas
                            </TableCell>
                            <TableCell className="text-right">
                                { values.map((value) => value.quantity).reduce((partialSum, a) => partialSum + a, 0) }
                            </TableCell>
                        </TableRow>
                    }
                    {
                        values.length > 0 &&  <TableRow>
                            <TableCell>
                                &nbsp;
                            </TableCell>
                            <TableCell>
                                &nbsp;
                            </TableCell>
                            <TableCell>
                                &nbsp;
                            </TableCell>
                            <TableCell>
                                Total harga
                            </TableCell>
                            <TableCell className="text-right">
                                { formatRupiah(values.map((value) => value.line_amount).reduce((partialSum, a) => partialSum + a, 0)) }
                            </TableCell>
                        </TableRow>
                    }
                    {
                        values.length == 0 && editingRowId == null &&  <TableRow>
                            <TableCell className="text-center" colSpan={6}>
                                Tekan <span className="font-bold">Tambah Produk</span> untuk menambahkan produk
                            </TableCell>
                        </TableRow>
                    }
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
    );
}

export default FieldTransferProduct;