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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Trash } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { IoMdAdd, IoMdClose, IoMdSave } from "react-icons/io";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ProductTransferDetail } from "@/app/api/product/product-transfers/type";
import { Product } from "@/app/api/product/type";
import { ProductUnits } from "@/app/api/product/product-unit/type";


const TransferProduct_COLUMNS = ["Produk", "Satuan", "Kuantitas"];

interface FieldTransferProductProps {
    form: any;
    products: Product[];
    productUnits: ProductUnits[];
}

const FieldTransferProduct: FC<FieldTransferProductProps> = ({
    form,
    products,
    productUnits
}) => {
    const [values, setValues] = useState<ProductTransferDetail[]>([])
    const [productsData, setTransferProductData] = useState<Product[]>(products);
    const [editingRowId, setEditingRowId] = useState<number | string | null>(null);
    const [transferProductValue, setTransferProductValue] = useState("");
    const [productUnitValue, setProductUnitValue] = useState("");
    const inputQuantityRef = useRef<HTMLInputElement>(null);

    // combo box
    const [open, setOpen] = useState(false)

    const handleSelectProductUnit = (value: string) => {
        setProductUnitValue(value);
    }

    const handleSaveValue = () => {
        const quantity = inputQuantityRef.current?.value;

        if (!transferProductValue || !productUnitValue || !quantity || +quantity <= 0) {
            return;
        }

        const newValue: any = [...values, {
            product_id: +transferProductValue,
            product_unit_id: +productUnitValue,
            quantity: +quantity
        }];

        setValues(newValue);

        form.setValue("products", newValue);

        setTransferProductData((prev) => prev.filter((item) => item.id != +transferProductValue));

        // Reset value
        setTransferProductValue("");
        setProductUnitValue("");
        inputQuantityRef.current.value = "";
        setEditingRowId(null);
    };

    const handleDelete = (index: number) => {
        const newValue = values.filter((_, i) => i !== index);
        setValues(newValue);
        form.setValue("products", newValue);

        const product = values[index];
        setTransferProductData((prev) => [...prev, products.find((item) => item.id == product.product_id) as Product]);
    }

    const onAdd = () => {
        setEditingRowId("tambah");
    }

    const onCancel = () => {
        setEditingRowId(null);
    }

    useEffect(() => {
        const val = form.getValues("products");

        if (val && val.length > 0) {
            setValueTransferProducts(val, form);
        }

    }, [form]);

    const setValueTransferProducts = (data: any, form: any) => {
        const value = data && data.map((item: any) => {
            return {
                product_id: item.product_id,
                product_unit_id: item.product_unit_id,
                quantity: item.quantity
            }
        })
        form.setValue("products", value);
    }

    return (
        <div>
            <FormLabel className="block">Produk</FormLabel>
            <Button variant="secondary" className="ml-auto mt-4" onClick={() => onAdd()} type="button">
                <IoMdAdd className="mr-2" /> Tambah Produk
            </Button>

            <Table className="border rounded-xl mt-4">
                <TableHeader>
                    <TableRow>
                        {TransferProduct_COLUMNS.map(
                            (item: string, i: number) => (
                                <TableHead key={item + i}>{item}</TableHead>
                            )
                        )}
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        editingRowId === "tambah" && (
                            <TableRow>
                                <TableCell>
                                    <FormItem>
                                        <Popover open={open} onOpenChange={setOpen}>
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
                                        </Popover>
                                    </FormItem>
                                </TableCell>
                                <TableCell>
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
                    {values.map((item: ProductTransferDetail, i: number) => {
                        const product = products.find((product) => product.id == item.product_id)?.name;
                        const productUnit = productUnits.find((productUnit) => productUnit.id == item.product_unit_id)?.name;

                        return (
                            <TableRow key={i}>
                                <TableCell>{product}</TableCell>
                                <TableCell>{productUnit}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
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
    );
}

export default FieldTransferProduct;