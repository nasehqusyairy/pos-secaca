"use client"

import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { capitalizeWords } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetLocationQuery } from "@/app/api/locations/queries";
import { useCreateProductTransferMutation } from "@/app/api/product/mutation";
import { formTransferRequestSchema } from "@/app/api/product/product-transfers/schema";
import FieldTransferProduct from "./form-transfer";
import { useGetProductsQuery, useGetProductUnitQuery } from "@/app/api/product/queries";
import { TransferProductRequest } from "@/app/api/product/product-transfers/type";
import { Locations } from "@/app/api/locations/type";

interface FormTransferProductPageProps {
    refetch: () => void
    onHiddenForm: () => void
}

const FormTransferProductPage: FC<FormTransferProductPageProps> = ({
    refetch,
    onHiddenForm
}) => {
    const [locationSelected, setLocationSelected] = useState<Locations[]>([]);

    const addTransferProduct = useCreateProductTransferMutation();

    const { data: locationData, isPending: isPendingLocation } = useGetLocationQuery(100);
    const { data: productsData, isPending: isPendingProducts } = useGetProductsQuery(100);
    const { data: productUnitsData, isPending: isPendingProductUnits } = useGetProductUnitQuery(100);

    const form = useForm<z.infer<typeof formTransferRequestSchema>>({
        resolver: zodResolver(formTransferRequestSchema)
    });

    // Function to set form values based on data
    // const setFormValues = (data: TransferProduct) => {
    //     form.getValues('from_location_id') ?? form.setValue('from_location_id', data.from_location_id.toString());
    //     form.getValues('to_location_id') ?? form.setValue('to_location_id', data.to_location_id.toString());
    // };

    const onSubmit = (values: z.infer<typeof formTransferRequestSchema>) => {
        if (addTransferProduct.isPending) return;

        const formattedData = {
            ...values,
            auto_approve: false
        } as unknown as TransferProductRequest;

        addTransferProduct.mutate(formattedData, {
            onSuccess: () => {
                showToastSuccess("Berhasil Create Transfer Product");
                refetch();
                form.reset();
                onHiddenForm();
            },
            onError: () => {
                showToastError("Gagal Create Transfer Product");
                onHiddenForm();
                form.reset();
            }
        });
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

    // Function to handle from location change
    const fromLocationChange = (value: string) => {
        form.setValue('from_location_id', value);
        form.setValue('to_location_id', '');

        const locationNotSelected = locations.filter((item: Locations) => item.id !== +value);
        setLocationSelected(() => locationNotSelected);
    }

    return (
        <div >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-2 gap-4">
                        {/* Row 1 */}
                        <FormField
                            control={form.control}
                            name="from_location_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dari Lokasi</FormLabel>
                                    <Select
                                        onValueChange={fromLocationChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih dari lokasi" />
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
                            name="to_location_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lokasi Tujuan</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Lokasi Tujuan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {locationSelected.map(
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
                        {/* Row 2 */}
                        <FormField
                            control={form.control}
                            name="request_note"
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
                        <div>

                        </div>
                    </div>

                    {/* Products */}
                    <FieldTransferProduct form={form} products={products} productUnits={productUnits} />
                    <div className='flex gap-4'>
                        <Button className='w-[150px]'>
                            {addTransferProduct.isPending ? 'Processing...' : 'Tambah'}
                        </Button>
                        <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Batal</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default FormTransferProductPage;