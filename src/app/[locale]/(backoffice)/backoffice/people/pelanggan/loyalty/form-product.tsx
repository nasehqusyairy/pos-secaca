"use client"

import { LoyaltyRewardProduct } from "@/app/api/people/pelanggan/loyalty/type";
import ProductDropdownSelect from "@/components/templates/Dropdowns/product-dropdown";
import { Button } from "@/components/ui/button";
import { FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductDropdown } from "@/types/dropdown";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { IoMdAdd, IoMdClose, IoMdSave } from "react-icons/io";

const Columns = ["produk", "product_unit", "point", "maximum_quantity"];

interface FieldRewardProductProps {
    onAddProduct: (rows: LoyaltyRewardProduct[]) => void;
    onDeleteProduct: (rows: LoyaltyRewardProduct[]) => void;
    viewMode?: boolean,
    reward_products?: LoyaltyRewardProduct[];
}

const FieldRewardProduct: FC<FieldRewardProductProps> = (props: FieldRewardProductProps) => {
    const t = useTranslations();

    const inputPoint = useRef<HTMLInputElement>(null);
    const inputMaximumQuantity = useRef<HTMLInputElement>(null);

    const [editingRowId, setEditingRowId] = useState<number>(-2);
    const [rows, setRows] = useState<LoyaltyRewardProduct[]>(props.reward_products ?? [])
    const [deletedRows, setDeletedRows] = useState<LoyaltyRewardProduct[]>([])
    const [product, setProduct] = useState<ProductDropdown | null>(null);

    useEffect(() => { 
        props.onAddProduct(rows)
    }, [rows]);

    useEffect(() => { 
        props.onDeleteProduct(deletedRows)
    }, [deletedRows]);

    useEffect(() => { 
        if (editingRowId < 0) return

        const filtered_row = rows[editingRowId]

        if (inputPoint && inputPoint.current) {
            inputPoint.current.value = filtered_row.point_needed.toString()
        }

        if (inputMaximumQuantity && inputMaximumQuantity.current && filtered_row.maximum_quantity) {
            inputMaximumQuantity.current.value = filtered_row.maximum_quantity.toString()
        }

        if (filtered_row.product && filtered_row.product_unit) {
            setProduct({
                ...filtered_row.product,
                product_unit: filtered_row.product_unit,
            })
        }
    }, [editingRowId]);

    const inputToNumber = (ref: RefObject<HTMLInputElement>, default_value: number | null = 0): number | null => {
        if (!ref || !ref.current || ref.current.value == '') return default_value;

        return parseInt(ref.current.value)
    }

    const handleEditLine = (row: number) => {
        setEditingRowId(row)
    }

    const handleDeleteLine = (row: number) => {
        setDeletedRows(prev => rows.map((loyalty, i) => {
            return {...loyalty, _destroy: i === row}
        }).filter((loyalty) => loyalty._destroy).concat(prev))

        setRows(prev => prev.filter((_, i) => i !== row))
    }

    const handleSaveValue = () => {
        if (!product) return

        const point_needed = inputToNumber(inputPoint);
        if (!point_needed) return;

        const maximum_quantity = inputToNumber(inputMaximumQuantity, null);

        const new_row = {
            _destroy: false,
            product_id: product.id,
            product: product,
            product_unit_id: product.product_unit?.id,
            product_unit: product.product_unit,
            point_needed,
            maximum_quantity
        } as LoyaltyRewardProduct

        setRows(prev => [...prev, new_row])
        setEditingRowId(-2)
    }

    const handleCancel = () => {
        setProduct(null)
        setEditingRowId(-2)
    }

    return (
        <div>
            <FormLabel className="block">{t('produk')}</FormLabel>
            <Button variant="secondary" className="ml-auto mt-4" onClick={() => setEditingRowId(-1)} type="button" disabled={editingRowId >= -1 || props.viewMode}>
                <IoMdAdd className="mr-2" /> {t('add_new_your', { name: t('produk') })}
            </Button>
            <FormControl>
                <Table className="border rounded-xl mt-4">
                    <TableHeader>
                        <TableRow>
                            {Columns.map(
                                (item: string, i: number) => (
                                    <TableHead key={item + i}>{t(item)}</TableHead>
                                )
                            )}
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            editingRowId < -1 ? <></> : <TableRow key='new-0'>
                                <TableCell>
                                    <ProductDropdownSelect
                                        defaultValue={product}
                                        handleValueChange={setProduct}
                                    />
                                </TableCell>
                                <TableCell>
                                    {product?.product_unit?.name}
                                </TableCell>
                                <TableCell>
                                    <Input
                                        ref={inputPoint}
                                        placeholder={t('enter_your', { name: t('point') })}
                                        readOnly={props.viewMode}
                                        type="number"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        ref={inputMaximumQuantity}
                                        placeholder={t('enter_your', { name: t('maximum_quantity') })}
                                        readOnly={props.viewMode}
                                        type="number"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button onClick={handleSaveValue} type="button">
                                            <IoMdSave className="w-4 h-4" />
                                        </Button>
                                        <Button onClick={handleCancel} variant="secondary">
                                            <IoMdClose className="w-4 h-4" style={{ color: 'red' }} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        }
                        {
                            rows.map((item: LoyaltyRewardProduct, i: number) => {
                                return (
                                    <TableRow key={'row-' + i}>
                                        <TableCell>{item.product?.name}</TableCell>
                                        <TableCell>{item.product_unit?.name}</TableCell>
                                        <TableCell>{item.point_needed}</TableCell>
                                        <TableCell>{item.maximum_quantity}</TableCell>
                                        <TableCell className="w-[120px]">
                                            <Button className="mr-1" type="button" size="icon" variant="outline" onClick={() => handleDeleteLine(i)} disabled={props.viewMode}>
                                                <Trash className="w-4 h-4" style={{ color: 'red' }} />
                                            </Button>
                                            {/* <Button type="button" size="icon" variant="outline" onClick={() => handleEditLine(i)} disabled={props.viewMode}>
                                                <Pencil className="w-4 h-4" />
                                            </Button> */}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </FormControl>
            <FormMessage />
        </div>
    )
}

export default FieldRewardProduct;