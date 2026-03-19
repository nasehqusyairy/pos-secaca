"use client"

import { useGetLocationQuery } from "@/app/api/locations/queries";
import { useCreateProductOpnameMutation, useUpdateProductTOpnameMutation } from "@/app/api/product/mutation";
import { formProductOpnameRequestSchema } from "@/app/api/product/product-opname/schema";
import { useGetProductsQuery, useGetProductUnitQuery } from "@/app/api/product/queries";
import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { capitalizeWords } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FieldProductOpname from "./form-product";
import { useRouter } from "next/navigation";
import { Locations } from "@/app/api/locations/type";
import { ParamsProductOpname, ProductOpnameRequest, ProductsDetail } from "@/app/api/product/type";
import { ProductOpnameResponse } from "@/app/api/product/product-opname/type";

interface FormProductOpnamePageProps {
    refetch: () => void
    onHiddenForm: () => void
    data?: ProductOpnameResponse | null
}
 
const FormProductOpnamePage: FC<FormProductOpnamePageProps> = ({
    refetch,
    onHiddenForm,
    data
}) => {
    const router = useRouter();

    const addProductOpname = useCreateProductOpnameMutation();
    const updateProductOpname = useUpdateProductTOpnameMutation();
    
    const [locId, setLocId] = useState<number>(0);
    const [state, setState] = useState<string>("");

    const { data: locationData, isPending: isPendingLocation } = useGetLocationQuery(100);
    const { data: productsData, isPending: isPendingProducts } = useGetProductsQuery(100);
    const { data: productUnitsData, isPending: isPendingProductUnits } = useGetProductUnitQuery(100);

    const form = useForm<z.infer<typeof formProductOpnameRequestSchema>>({
        resolver: zodResolver(formProductOpnameRequestSchema)
    });

    useEffect(() => {
        if (data) {
            const products = data.product_opname_service_details?.map((data: any) => {
                return {
                    id: data.id,
                    product_id: data.product_id,
                    product_unit_id: data.product_unit_id,
                    recorded_stock: data.recorded_stock,
                    counted_stock: data.counted_stock,
                    difference_stock: data.difference_stock,
                    note: data.note,
                    product_category_id: data.product_category_id
                }
            })
    
            form.setValue("location_id", data.location_id.toString())
            form.setValue("note", data.note)
            form.setValue("products", products as any)

            // setlocId
            setLocId(data.location_id)
            setState("EDIT")
        } else {
            setState("")
        }
    }, [data]);

    // Function to set form values based on data
    const onSubmit = (values: z.infer<typeof formProductOpnameRequestSchema>) => {
        if (addProductOpname.isPending || updateProductOpname.isPending) return;

        if(state === "EDIT"){
            const products = values.products.map(product => {
                const isDeleted = data ? data?.product_opname_service_details?.find((d: any) => d.id === product.id) : null;

                return {
                    id: product.id ?? 0,
                    _deleted: isDeleted ? false : true,
                    product_id: product.product_id,
                    product_unit_id: product.product_unit_id,
                    product_category_id: product.product_category_id,
                    recorded_stock: product.recorded_stock,
                    counted_stock: product.counted_stock,
                    difference_stock: product.difference_stock,
                    note: product.note
                } as unknown as ProductsDetail
            })

            const formattedData = {
                id: data?.id,
                products
            } as ParamsProductOpname;

            updateProductOpname.mutate(formattedData, {
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
        } as unknown as ProductOpnameRequest;

        // addProductOpname.mutate(formattedData, {
        //     onSuccess: () => {
        //         showToastSuccess("Berhasil Create Product Opname");
        //         refetch();
        //         form.reset();
        //         onHiddenForm();
        //     },
        //     onError: () => {
        //         showToastError("Gagal Create Product Opname");
        //         onHiddenForm();
        //         form.reset();
        //     }
        // });
    }

    const valueChangeLocation = (field: any) => {
        setLocId(field)
        form.setValue("location_id", field)
    }

    const onCancel = () => {
        form.reset();
        onHiddenForm();
    };

    if (isPendingLocation || isPendingProducts || isPendingProductUnits) {
        return <SkeletonFormPage />;
    }

    // Get Data checking
    const locations = locationData?.data ?? [];
    const products = productsData?.data ?? [];
    const productUnits = productUnitsData?.data ?? [];

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
                            name="location_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lokasi</FormLabel>
                                    <Select
                                        onValueChange={valueChangeLocation}
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
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Catatan</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Masukkan Catatan"
                                            {...field}
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Products */}
                    <FieldProductOpname form={form} products={products} productUnits={productUnits} location_id={locId} />

                    {/* Button */}
                    <div className='flex gap-4'>
                        <Button className='w-[150px]'>
                            {addProductOpname.isPending || updateProductOpname.isPending ? 'Processing...' : state === '' ? 'Submit' : 'Update'}
                        </Button>
                        <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Batal</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default FormProductOpnamePage;