"use client"

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
import { useGetLocationQuery } from "@/app/api/locations/queries";
import { useUpdateProductTransferMutation } from "@/app/api/product/mutation";
import { formTransferRequestSchema } from "@/app/api/product/product-transfers/schema";
import FieldTransferProduct from "./form-transfer";
import { useGetProductsQuery, useGetProductTransferQuery, useGetProductUnitQuery } from "@/app/api/product/queries";
import { useRouter } from "next/navigation";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { TransferProduct, TransferProductRequest } from "@/app/api/product/product-transfers/type";
import { Locations } from "@/app/api/locations/type";

interface FormTransferProductPageProps {
    params: {
        id: string
    }
}

const FormTransferProductPage: FC<FormTransferProductPageProps> = ({
    params
}) => {
    const [locationSelected, setLocationSelected] = useState<Locations[]>([]);

    const updateTransferProduct = useUpdateProductTransferMutation();

    const { data: locationData, isPending: isPendingLocation } = useGetLocationQuery(100);
    const { data: productsData, isPending: isPendingProducts } = useGetProductsQuery(100);
    const { data: productUnitsData, isPending: isPendingProductUnits } = useGetProductUnitQuery(100);

    const id = params.id;
    const { data: existingData, isPending: isPendingExistingData } = useGetProductTransferQuery(id);

    const form = useForm<z.infer<typeof formTransferRequestSchema>>({
        resolver: zodResolver(formTransferRequestSchema)
    });

    // Function to set form values based on data
    const setFormValues = (data: TransferProduct) => {
        form.getValues('from_location_id') ?? form.setValue('from_location_id', data.from_location_id?.toString());
        form.getValues('to_location_id') ?? form.setValue('to_location_id', data.to_location_id?.toString());
        form.getValues('request_note') ?? form.setValue('request_note', data.request_note);
    };

    useEffect(() => {
        if (existingData?.data) {
            setFormValues(existingData.data);

            // set location selected
            const locationNotSelected = locationData?.data?.filter((item: Locations) => item.id !== existingData.data.from_location_id);
            setLocationSelected(locationNotSelected);
        }
    }, [existingData, locationData]);

    const router = useRouter();

    // Check if data is exist
    const onSubmit = (values: z.infer<typeof formTransferRequestSchema>) => {
        if (updateTransferProduct.isPending) return;

        const formattedData = {
            ...values,
            id: id,
            auto_approve: false
        } as unknown as TransferProductRequest;

        // const valueForm = removeNullOrUndefined(dataForm);
        updateTransferProduct.mutate(formattedData, {
            onSuccess: () => {
                showToastSuccess("Berhasil Update Transfer Product");
                form.reset();
                router.push('..')
            },
            onError: () => {
                showToastError("Gagal Update Transfer Product");
                form.reset();
            }
        });
    }

    const onCancel = () => {
        form.reset();
        router.push('..')
    };

    if (isPendingLocation || isPendingProducts || isPendingProductUnits || isPendingExistingData) {
        return <SkeletonFormPage />;
    }

    // Get Data checking
    const locations = locationData?.data ?? [];
    const products = productsData?.data ?? [];
    const productUnits = productUnitsData?.data ?? [];
    const data = existingData?.data ?? {};

    const isApproved = data?.status === 'approved' || data?.status === 'rejected';
    const isRejected = data?.status === 'rejected';

    // set location selected
    setFormValues(data);

    // Function to handle from location change
    const fromLocationChange = (value: string) => {
        form.setValue('from_location_id', value);

        // check same location with to location
        const toLocation = form.getValues('to_location_id');
        if (value === toLocation) {
            form.setValue('to_location_id', '');
        }

        const locationNotSelected = locations.filter((item: Locations) => item.id !== +value);
        setLocationSelected(() => locationNotSelected);
    }

    return (
        <div >
            <PageTitleSetting title="Transfer Produk" subtitle="Atur Transfer Produk"></PageTitleSetting>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 mt-10"
                >
                    <div className="grid grid-cols-2 gap-4">
                        {/* Row 1 */}
                        <FormField
                            control={form.control}
                            name="from_location_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Asal Lokasi</FormLabel>
                                    <Select
                                        onValueChange={fromLocationChange}
                                        defaultValue={field.value}
                                        disabled={isApproved}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a from location" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {locations && locations.map(
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
                                    <FormLabel>Tujuan Lokasi</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isApproved}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a to location" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {locationSelected && locationSelected.map(
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
                                            placeholder="Masukkan catatan"
                                            {...field}
                                            value={field.value ?? ''}
                                            disabled={isApproved}
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
                    <FieldTransferProduct form={form} products={products} productUnits={productUnits} data={data} isApproved={isApproved} />
                    <div className='flex gap-4'>
                        <Button className='w-[150px]' disabled={isApproved}>
                            {updateTransferProduct.isPending ? 'Processing...' : 'Rubah'}
                        </Button>
                        <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>batal</Button>
                    </div>
                    {
                        isRejected && <p>*Produk transfer sudah di tolak, tidak bisa di rubah</p>
                    }
                    {
                        (isApproved && !isRejected) && <p>*Produk transfer sudah di setujui, tidak bisa di rubah</p>
                    }
                </form>
            </Form>
        </div>
    );
}

export default FormTransferProductPage;