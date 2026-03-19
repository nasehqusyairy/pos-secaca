"use client"

import { Locations } from "@/app/api/locations/type";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ParamsProductStockMovement } from "@/app/api/product/type";
import { Check, ChevronsUpDown, Pencil, Trash } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IoMdClose, IoMdSave } from "react-icons/io";
import { ProductLocationStocks } from "@/app/api/catalogues/type";

interface FormProductStockMovementPageProps {
    form: any;
    buyingPrice: number;
    locations: Locations[];
    locationsProducts?: ProductLocationStocks[] | null;
}

const FormProductStockMovementPage: FC<FormProductStockMovementPageProps> = ({
    form,
    buyingPrice,
    locations,
    locationsProducts,
}) => {
    const [mode, setMode] = useState<string>('')
    const [editingRow, setEditingRow] = useState<ParamsProductStockMovement | null>(null)
    const [stockMovements, setStockMovements] = useState<ParamsProductStockMovement[]>([])
    const [locationsData, setLocationsData] = useState<Locations[]>(locations);
    const [selectedLocationId, setSelectedLocationId] = useState<string>('')

    // combo box
    const [open, setOpen] = useState(false)

    // ref
    const inputStockRef = useRef<HTMLInputElement>(null);
    const inputCurrentStockRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        buildLocation(locations)
    }, [locations])

    useEffect(() => {
        if (inputCurrentStockRef.current) {
            inputCurrentStockRef.current.value = ''
        }

        if (selectedLocationId && locationsProducts) {
            const locationsProduct = locationsProducts.find((locationsProduct) => locationsProduct.location_id?.toString() == selectedLocationId)

            if (locationsProduct && inputCurrentStockRef.current) {
                inputCurrentStockRef.current.value = (locationsProduct.stock || 0).toString()
            }
        }
    }, [selectedLocationId])

    const handleAddRow = () => {
        setEditingRow(null)
        setMode('add')
    }

    const handleEditRow = (index: number) => {
        const editingRow = stockMovements[index] as ParamsProductStockMovement | null
        if (!editingRow) {
            return
        }
        setMode('edit')

        if (inputStockRef.current) {
            inputStockRef.current.value = editingRow.stock.toString();
        }

        setEditingRow(editingRow)
        // setLocationsData((prev) => [...prev, locations.find((item) => item.id == editingRow.location_id) as Locations]);
        setSelectedLocationId(editingRow.location_id.toString())

        handleDeleteRow(index)
    }

    const handleDeleteRow = (index: number) => {
        const newValues = stockMovements.filter((_, i) => i !== index)
        setStockMovements(newValues);

        const locationIds = newValues.map((newValue) => newValue.location_id)
        setLocationsData(locations.filter((location) => !locationIds.includes(location.id)));

        form.setValue("stock_movements", newValues);
    }

    const handleSaveRow = () => {
        const stock = inputStockRef.current?.value;

        if (!selectedLocationId || !stock || +stock <= -1) {
            return;
        }

        const newValues: ParamsProductStockMovement[] = [...stockMovements, {
            location_id: +selectedLocationId,
            buying_price: buyingPrice,
            current_stock: +(inputCurrentStockRef.current?.value || '0'),
            stock: +stock,
        }];
        setStockMovements(newValues);
        form.setValue("stock_movements", newValues);

        // locations.filter((item) => item.id != +selectedLocationId)
        setLocationsData((prev) => prev.filter((item) => item.id != +selectedLocationId));

        inputStockRef.current.value = "";
        setMode('');
        setSelectedLocationId('')
    }

    const onCancelSaveRow = () => {
        setMode('');
    }

    const buildLocation = (locations: Locations[]) => {
        const movements: ParamsProductStockMovement[] = []
        locations.forEach((loc) => {
            const locationsProduct = locationsProducts?.find((locationsProduct) => locationsProduct.location_id == loc.id)

            movements.push({
                location_id: loc.id,
                current_stock: locationsProduct?.stock || 0,
                stock: locationsProduct?.stock || 0,
                buying_price: locationsProduct?.average_buy_price || 0,
            })
        })

        setStockMovements(movements)
    }

    return (
        <div>
            <div className="flex justify-between items-end">
                <label className="text-xs md:text-base">
                    Stok
                </label>
                {/* <div>
                    <Button className="text-xs btn-xs" onClick={handleAddRow} type='button'>
                        Tambah
                    </Button>
                </div> */}
            </div>
            <div>
                <Table className="mt-4 border rounded-xl">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Lokasi</TableHead>
                            <TableHead>Stok Sekarang</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            mode !== '' && (
                                <TableRow>
                                    <TableCell>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="justify-between w-full"
                                                    type="button"
                                                >
                                                    {selectedLocationId
                                                        ? locationsData.find((location) => location.id?.toString() === selectedLocationId)?.name
                                                        : "Pilih lokasi..."}
                                                    <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput placeholder="Cari lokasi..." />
                                                    <CommandList>
                                                        <CommandEmpty>Lokasi tidak tersedia.</CommandEmpty>
                                                        <CommandGroup>
                                                            {locationsData.map((location) => (
                                                                <CommandItem
                                                                    key={`locations-${location.id}`}
                                                                    value={location.name || ""}
                                                                    onSelect={(currentValue) => {
                                                                        const value = locations.find((location) => location.name == currentValue)?.id;

                                                                        setSelectedLocationId(value?.toString() ?? "")
                                                                        setOpen(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 w-4 h-4",
                                                                            selectedLocationId === location.id?.toString() ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {location.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                    <TableCell>
                                        <FormControl>
                                            <Input
                                                ref={inputCurrentStockRef}
                                                type="number"
                                                className="w-full"
                                                disabled={true}
                                                defaultValue={editingRow?.current_stock}
                                            />
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <FormControl>
                                            <Input
                                                ref={inputStockRef}
                                                type="number"
                                                className="w-full"
                                                placeholder="Masukan stok"
                                                defaultValue={editingRow?.stock}
                                            />
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button onClick={handleSaveRow} type="button">
                                                <IoMdSave className="w-4 h-4" />
                                            </Button>
                                            <Button onClick={onCancelSaveRow} variant="secondary" type='button'>
                                                <IoMdClose className="w-4 h-4" style={{ color: 'red' }} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        {
                            stockMovements.map((item: ParamsProductStockMovement, index: number) => {
                                const location = locations.find((location) => location.id == item.location_id);

                                return (
                                    <TableRow key={`stock-movement-${index}`}>
                                        <TableCell>{location?.name}</TableCell>
                                        <TableCell>{item.current_stock}</TableCell>
                                        <TableCell>{item.stock}</TableCell>
                                        <TableCell className='w-[100px]'>
                                            <Button size="icon" variant="outline" onClick={() => handleEditRow(index)} type="button">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            {/* <Button size="icon" variant="outline" onClick={() => handleDeleteRow(index)} type="button">
                                                <Trash className="w-4 h-4" style={{ color: 'red' }} />
                                            </Button> */}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default FormProductStockMovementPage;