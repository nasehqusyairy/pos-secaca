"use client"

import { useGetLocationQuery } from "@/app/api/locations/queries";
import { useCreateProductAdjustmentStockMutation, useUpdateProductAdjustmentStockMutation } from "@/app/api/product/mutation";
import { formProductAdjustmentStockRequestSchema } from "@/app/api/product/product-adjustment-stock/schema";
import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { capitalizeWords } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FieldProductAdjustmentStock from "./form-product";
import { useRouter } from "next/navigation";
import { Locations } from "@/app/api/locations/type";
import { ParamsProductAdjustmentStock, ProductAdjustmentStockRequest, ProductsDetail } from "@/app/api/product/type";
import { ProductAdjustmentStock } from "@/app/api/product/product-adjustment-stock/type";
import { FormDatePicker } from "@/components/ui/form-date-picker";

interface FormProductAdjustmentStockPageProps {
    refetch: () => void
    onHiddenForm: () => void
    data?: ProductAdjustmentStock | null
    selectedId?: string,
    disabled: boolean,
}
 
const FormProductAdjustmentStockPage: FC<FormProductAdjustmentStockPageProps> = ({
    refetch,
    onHiddenForm,
    selectedId,
    disabled,
    data
}) => {
    const router = useRouter();

    const addProductAdjustmentStock = useCreateProductAdjustmentStockMutation();
    const updateProductAdjustmentStock = useUpdateProductAdjustmentStockMutation();
    
    const [locId, setLocId] = useState<number>(0);
    const [state, setState] = useState<string>("");

    const { data: locationData, isPending: isPendingLocation } = useGetLocationQuery(100);

    const form = useForm<z.infer<typeof formProductAdjustmentStockRequestSchema>>({
        resolver: zodResolver(formProductAdjustmentStockRequestSchema),
        defaultValues: {
            date: data?.local_requested_at.toString(),
            location_id: data?.location_id.toString(),
            auto_approve: false,
            note: data?.request_note,
            recorded_product_count: data?.recorded_product_count.toString(),
            counted_product_count: data?.counted_product_count.toString(),
            difference_product_count: data?.difference_product_count.toString(),
            recorded_stock: data?.recorded_stock.toString(),
            counted_stock: data?.counted_stock.toString(),
            difference_stock: data?.difference_stock.toString(),
            products: data?.product_adjustment_stock_details?.map((x) => ({ 
                id: x.id,
                product_id: x.product_id,
                product_unit_id: x.product_unit_id,
                product_category_id: x.product_category_id,
                recorded_stock: x.recorded_stock ,
                counted_stock: x.counted_stock ,
                difference_stock: x.difference_stock ,
            })),
        }
    });

    // useEffect(() => {
    //     if (data) {
    //         const products = data.product_adjustment_stock_details?.map((data: any) => {
    //             return {
    //                 id: data.id,
    //                 product_id: data.product_id,
    //                 product_unit_id: data.product_unit_id,
    //                 recorded_stock: data.recorded_stock,
    //                 counted_stock: data.counted_stock,
    //                 difference_stock: data.difference_stock,
    //                 note: data.note,
    //                 product_category_id: data.product_category_id
    //             }
    //         })
    
    //         form.setValue("location_id", data.location_id.toString())
    //         form.setValue("note", data.note)
    //         form.setValue("products", products as any)

    //         // setlocId
    //         setLocId(data.location_id)
    //         setState("EDIT")
    //     } else {
    //         setState("")
    //     }
    // }, [data]);

    // Function to set form values based on data
    const onSubmit = (values: z.infer<typeof formProductAdjustmentStockRequestSchema>) => {
        if (addProductAdjustmentStock.isPending || updateProductAdjustmentStock.isPending) return;

        if(state === "EDIT"){
            const products = values.products.map(product => {
                const isDeleted = data ? data?.product_adjustment_stock_details?.find((d: any) => d.id === product.id) : null;

                return {
                    id: product.id ?? 0,
                    _deleted: isDeleted ? false : true,
                    product_id: product.product_id,
                    // product_unit_id: product.product_unit_id,
                    // product_category_id: product.product_category_id,
                    // recorded_stock: product.recorded_stock,
                    // counted_stock: product.counted_stock,
                    // difference_stock: product.difference_stock,
                    // note: product.note
                } as unknown as ProductsDetail
            })

            const formattedData = {
                id: data?.id,
                products
            } as ParamsProductAdjustmentStock;

            updateProductAdjustmentStock.mutate(formattedData, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Product Opname");
                    refetch();
                    form.reset();
                    onHiddenForm();

                    router.back()
                },
                onError: () => {
                    showToastError("Gagal Update Product Opname");
                    onHiddenForm();
                    form.reset();
                }
            });
            return
        }
        const formDataProduct = form.getValues("products")

        const formattedData = {
            ...values,
            location_id: +form.getValues("location_id"),
            note: form.getValues("note") ?? null,
            auto_approve: true,
            recorded_product_count: formDataProduct.length,
            counted_product_count: formDataProduct.length,
            difference_product_count: formDataProduct.length,
            recorded_stock: 0,
            counted_stock: 0,
            difference_stock: 0,
        } as unknown as ProductAdjustmentStockRequest;

        addProductAdjustmentStock.mutate(formattedData, {
            onSuccess: () => {
                showToastSuccess("Berhasil Create Product Opname");
                refetch();
                form.reset();
                onHiddenForm();
            },
            onError: () => {
                showToastError("Gagal Create Product Opname");
                onHiddenForm();
                form.reset();
            }
        });
    }

    const valueChangeLocation = (field: any) => {
        setLocId(field)
        form.setValue("location_id", field)
    }

    const onCancel = () => {
        form.setValue("products", [])
        form.reset();

        onHiddenForm();
    };

    if (isPendingLocation) {
        return <SkeletonFormPage />;
    }

    // Get Data checking
    const locations = locationData?.data ?? [];

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggal</FormLabel>
                                    <FormDatePicker 
                                        today={new Date()}
                                        disabled={true}
                                        key="date-time-now" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lokasi</FormLabel>
                                    <Select
                                        onValueChange={valueChangeLocation}
                                        disabled={disabled}
                                        defaultValue={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih lokasi" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {locations.map(
                                                (
                                                    item: Locations
                                                ) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id?.toString() ?? ''}
                                                    >
                                                        {capitalizeWords(item.name)}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Products */}
                    <FieldProductAdjustmentStock
                        form={form}
                        data={data}
                        disabled={disabled}
                        location_id={locId} />

                    {/* Button */}
                    <div className='flex gap-4'>
                        {
                            !disabled && <Button className='w-[150px]'>
                                {addProductAdjustmentStock.isPending || updateProductAdjustmentStock.isPending ? 'Processing...' : state === '' ? 'Submit' : 'Update'}
                            </Button>
                        }
                        <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Batal</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default FormProductAdjustmentStockPage;