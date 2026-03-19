"use client"

import { useGetLocationQuery } from "@/app/api/locations/queries";
import { useCreateProductOpnameMutation, useUpdateProductOpnameMutation } from "@/app/api/product/mutation";
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
import { useRouter } from "next/navigation";
import { Locations } from "@/app/api/locations/type";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { ProductOpnameRequest, ProductOpnameResponse } from "@/app/api/product/product-opname/type";
import FieldProduct from "./form-product";
import { useLocale } from "next-intl";

interface FormProductStockOpnamePageProps {
    refetch: () => void
    onHiddenForm: () => void
    data?: ProductOpnameResponse | null
    selectedId?: string,
    preview?: boolean,
    preview_page?: number,
    disabled: boolean,
}
 
const FormProductStockOpnamePage: FC<FormProductStockOpnamePageProps> = ({
    refetch,
    onHiddenForm,
    selectedId,
    disabled,
    preview,
    preview_page,
    data
}) => {
    const router = useRouter()
    const locale = useLocale()

    const addMutation = useCreateProductOpnameMutation();
    const updateMutation = useUpdateProductOpnameMutation();
    
    const { data: locationData, isPending: isPendingLocation } = useGetLocationQuery(100);
    const [locId, setLocId] = useState<number>(data?.location_id || 0);

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
            products: data?.product_opname_service_details?.map((x) => ({ 
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

    // Function to set form values based on data
    const onSubmit = (values: z.infer<typeof formProductAdjustmentStockRequestSchema>) => {
        if (addMutation.isPending || updateMutation.isPending) return;

        const formDataProduct = form.getValues("products")

        let recorded_stock = 0
        let counted_stock = 0
        let difference_stock = 0
        formDataProduct.forEach((x) => {
            recorded_stock += x.recorded_stock
            counted_stock += x.counted_stock
            difference_stock += x.difference_stock
        })

        const formattedData = {
            ...values,
            id: selectedId,
            location_id: +form.getValues("location_id"),
            note: form.getValues("note") ?? null,
            auto_approve: true,
            recorded_product_count: formDataProduct.length,
            counted_product_count: formDataProduct.length,
            difference_product_count: formDataProduct.length,
            recorded_stock,
            counted_stock,
            difference_stock,
        } as unknown as ProductOpnameRequest;

        if (!selectedId) {
            create(formattedData)
        } else {
            update(formattedData)
        }
    }

    const create = (data: ProductOpnameRequest) => {
        if (selectedId) return

        addMutation.mutate(data, {
            onSuccess: (result) => {
                showToastSuccess("Berhasil Menambahkan Product Opname");
                form.reset();

                // to preview
                const id = result.data.id
                router.push(`/${locale}/backoffice/stock/stock-opname/${id}/preview?show=true`)
            },
            onError: () => {
                showToastError("Gagal Menambahkan Product Opname");
                form.reset();

                onHiddenForm();
            }
        });
    }

    const update = (data: ProductOpnameRequest) => {
        if (!selectedId) return

        updateMutation.mutate(data, {
            onSuccess: () => {
                showToastSuccess("Berhasil Merubah Product Opname");
                form.reset();

                // to preview
                router.push(`/${locale}/backoffice/stock/stock-opname/${selectedId}/preview?show=true`)
            },
            onError: () => {
                showToastError("Gagal Merubah Product Opname");
                form.reset();

                onHiddenForm();
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
                    <FieldProduct
                        form={form}
                        data={data}
                        preview_page={preview_page}
                        disabled={disabled}
                        location_id={locId} />

                    {/* Button */}
                    { !preview && <div className='flex gap-4'>
                        {
                            !disabled && <Button className='w-[150px]'>
                                {addMutation.isPending || updateMutation.isPending ? 'Processing...' : !selectedId ? 'Submit' : 'Update'}
                            </Button>
                        }
                        <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Batal</Button>
                    </div>}
                </form>
            </Form>
        </div>
    )
}

export default FormProductStockOpnamePage;