"use client"

import { Button } from "@/components/ui/button";
import { FC, useEffect, useRef, useState } from "react";
import { IoMdClose, IoMdSave } from "react-icons/io";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useGetProductByKeywordQuery, useGetProductStockQuery } from "@/app/api/product/queries";
import { getProductStocks } from "@/app/api/product/api";
import { Product, ProductOpnameDetail } from "@/app/api/product/type";
import { ProductUnits } from "@/app/api/product/product-unit/type";

const ProductOpnameColumns = ["Produk", "Satuan", "Stok Tercatat", "Stok Terhitung", "Perbedaan"];

interface FieldProductOpnameProps {
    form: any;
    location_id: number,
    products: Product[];
    productUnits: ProductUnits[];
}

const FieldProductOpname: FC<FieldProductOpnameProps> = ({
    form,
    products,
    productUnits,
    location_id
}) => {
    const [values, setValues] = useState<ProductOpnameDetail[]>([])
    // const [productsData, setTransferProductData] = useState<Product[]>(products);
    const [editingRowId, setEditingRowId] = useState<number | string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [productData, setProductData] = useState<ProductOpnameDetail | null>(null);

    const inputProductRef = useRef<HTMLInputElement>(null);
    const inputProductUnitRef = useRef<HTMLInputElement>(null);
    const inputRecordedStockRef = useRef<HTMLInputElement>(null);
    const inputCountedStockRef = useRef<HTMLInputElement>(null);
    const inputDifferenceStockRef = useRef<HTMLInputElement>(null);
    const errorSearch = useRef<HTMLParagraphElement>(null)

    const { data: dataProductStock, isFetching: isFetchingProductStock, refetch: refetchProductStock } = useGetProductStockQuery({ 
        product: productData?.id ?? 0, 
        product_unit: productData?.product_unit_id ?? 0,
        location: location_id,
    });
    const {data, isLoading} = useGetProductByKeywordQuery(1, searchValue)

    useEffect(() => {
        if (values.length > 0) {
            values.forEach(async value => {
                // const dataProduct = await getProductStocks({
                //     product: Number(value.product_id),
                //     product_unit: Number(value.product_unit_id),
                //     location: location_id
                // });

                // setValues(prev => {
                //     const newValue = prev.map(data => {
                //         if (data.product_id == value.product_id) {
                //             data.recorded_stock = dataProduct.data.stock;
                //             data.difference_stock = data.counted_stock - dataProduct.data.stock;
                //         }

                //         return data;
                //     })

                //     return newValue;
                // })
            });
        }

    }, [location_id]);

    useEffect(() => {
        if(data?.data) {
            const product = data.data[0]
            if(!product) return

            setEditingRowId("tambah");
            setProductData(product)
            
            if(errorSearch.current) errorSearch.current.innerHTML = ""

            // check product is exist in list
            const isExistFromValues = values.find((data: ProductOpnameDetail) => data.product_id == product.id)
            if(isExistFromValues) return

            if(inputProductRef.current) inputProductRef.current.value = product.name
            if(inputProductUnitRef.current) inputProductUnitRef.current.value = product.product_unit.name

            refetchProductStock()
        } else {
            if(errorSearch.current) errorSearch.current.innerHTML = "Produk tidak ditemukan"
            setEditingRowId("");
        }

        if(!searchValue) if(errorSearch.current) errorSearch.current.innerHTML = ""
    }, [data, editingRowId]);

    const handleSaveValue = () => {
        const recorded_stock = inputRecordedStockRef.current?.value;
        const counted_stock = inputCountedStockRef.current?.value;

        if ( !recorded_stock || !counted_stock || +counted_stock <= 0) {
            return;
        }

        const newValue: any = [...values, {
            product_id: productData?.id,
            product_unit_id: productData?.product_unit_id,
            recorded_stock: +recorded_stock,
            counted_stock: +counted_stock,
            difference_stock: +counted_stock - +recorded_stock,
            note: null,
            product_category_id: null
        }];

        setValues(newValue);

        form.setValue("products", newValue);

        setSearchValue('')
        setProductData(null)

        inputRecordedStockRef.current.value = "";
        inputCountedStockRef.current.value = "";
        if (inputDifferenceStockRef.current) {
            inputDifferenceStockRef.current.value = "";
        }

        setEditingRowId(null);
    };

    const handleDelete = (index: number) => {
        const newValue = values.filter((_, i) => i !== index);
        setValues(newValue);
        form.setValue("products", newValue);
    }

    const onCancel = () => {
        setEditingRowId(null);
    }

    useEffect(() => {
        const val = form.getValues("products");

        if (val && val.length > 0) {
            setValueProductOpname(val, form);
        }

    }, [form]);

    useEffect(() => {
        if (isFetchingProductStock || inputRecordedStockRef.current == null) {
            return
        }

        inputRecordedStockRef.current.value = dataProductStock?.data?.stock ?? 0
        handleChangeCounterStock(Number(inputCountedStockRef.current?.value ?? '0'))
    }, [isFetchingProductStock])

    const setValueProductOpname = (data: any, form: any) => {
        const value = data && data.map((item: any) => {
            return {
                product_id: item.product_id,
                product_unit_id: item.product_unit_id,
                recorded_stock: item.recorded_stock,
                counted_stock: item.counted_stock,
                difference_stock: item.difference_stock,
            }
        })
        setValues(value);
    }

    const handleChangeCounterStock = (value: number) => {
        const recorded_stock = inputRecordedStockRef.current?.value;

        if (inputDifferenceStockRef.current) {
            if (recorded_stock !== undefined) {
                inputDifferenceStockRef.current.value = (+value - +recorded_stock).toString();
            }
        }
    }

    return (
        <div>
            <FormLabel className="block">Products</FormLabel>
            <div className="flex gap-2 mt-4">
                <Input
                    placeholder="Cari produk berdasarkan nama, barcode, ..."
                    className="w-full"
                    onChange={(e) => setSearchValue(e.target.value)}
                    disabled={location_id === 0}
                />
            </div>
            <p ref={errorSearch} className="text-sm mt-2"></p>


            <Table className="border rounded-xl mt-4">
                <TableHeader>
                    <TableRow>
                        {ProductOpnameColumns.map(
                            (item: string, i: number) => (
                                <TableHead key={item + i}>{item}</TableHead>
                            )
                        )}
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        editingRowId === "tambah" && (
                            <TableRow>
                                <TableCell>
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                ref={inputProductRef}
                                                className="w-full"
                                                placeholder="Product"
                                                disabled={true}
                                            />    
                                        </FormControl>
                                        {/* <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full justify-between"
                                                >
                                                    {transferProductValue
                                                        ? productsData.find((product) => product.id?.toString() === transferProductValue)?.name
                                                        : "Select product..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger> 
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search product..." />
                                                    <CommandList>
                                                        <CommandEmpty>Produk tidak tersedia.</CommandEmpty>
                                                        <CommandGroup>
                                                            {productsData.map((product) => (
                                                                <CommandItem
                                                                    key={product.id}
                                                                    value={product.name || ""}
                                                                    onSelect={(currentValue) => {
                                                                        const value = products.find((product) => product.name == currentValue)?.id;

                                                                        setTransferProductValue(value?.toString() ?? "")
                                                                        setOpen(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            transferProductValue === product.id?.toString() ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {product.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover> */}
                                    </FormItem>
                                </TableCell>
                                <TableCell>
                                    <FormControl>
                                        <Input
                                            ref={inputProductUnitRef}
                                            className="w-full"
                                            placeholder="Product Unit"
                                            disabled={true}
                                        />    
                                    </FormControl>
                                </TableCell>
                                {/* <TableCell>
                                    <FormItem>
                                        <Select value={productUnitValue} onValueChange={handleSelectProductUnit}>
                                            <SelectTrigger className="w-full" >
                                                <SelectValue placeholder="Select a Product unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {
                                                        productUnits?.map((item: ProductUnits, i: number) => (
                                                            <SelectItem key={i} value={item.id?.toString() || ''}>{item.name}</SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                </TableCell> */}
                                <TableCell>
                                    <FormControl>
                                        <Input
                                            ref={inputRecordedStockRef}
                                            type="number"
                                            className="w-full"
                                            placeholder="Stok Tercatat"
                                            disabled={true}
                                        />    
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <FormControl>
                                        <Input
                                            ref={inputCountedStockRef}
                                            onChange={(event) => handleChangeCounterStock(Number(event.target.value))}
                                            type="number"
                                            className="w-full"
                                            placeholder="Masukkan Stok Terhitung"
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <FormControl>
                                        <Input
                                            ref={inputDifferenceStockRef}
                                            type="number"
                                            className="w-full"
                                            placeholder="Masukkan perbedaan stok"
                                            disabled={true}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button onClick={handleSaveValue} type="button">
                                            <IoMdSave className="w-4 h-4" />
                                        </Button>
                                        <Button onClick={onCancel} variant="secondary">
                                            <IoMdClose className="w-4 h-4" style={{ color: 'red' }} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    }
                    {values.map((item: ProductOpnameDetail, i: number) => {
                        const product = products.find((product) => product.id == item.product_id)?.name;
                        const productUnit = productUnits.find((productUnit) => productUnit.id == item.product_unit_id)?.name;

                        return (
                            <TableRow key={i}>
                                <TableCell>{product}</TableCell>
                                <TableCell>{productUnit}</TableCell>
                                <TableCell>{item.recorded_stock}</TableCell>
                                <TableCell>{item.counted_stock}</TableCell>
                                <TableCell>{item.difference_stock}</TableCell>
                                <TableCell className={cn("w-[100px]")}>
                                    <Button size="icon" variant="outline" onClick={() => handleDelete(i)}>
                                        <Trash className="w-4 h-4" style={{ color: 'red' }} />
                                    </Button>
                                </TableCell>

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

export default FieldProductOpname;