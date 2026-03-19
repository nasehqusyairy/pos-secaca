"use client"

import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage";
import { showConfirmationApprovalAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
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
import { useApproveProductTransferMutation, useCreateProductTransferMutation, useRejectProductTransferMutation, useUpdateProductTransferMutation } from "@/app/api/product/mutation";
import { formTransferRequestSchema } from "@/app/api/product/product-transfers/schema";
import FieldTransferProduct from "./form-transfer";
import { TransferProduct, TransferProductRequest } from "@/app/api/product/product-transfers/type";
import { Locations } from "@/app/api/locations/type";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { Ban, Check } from "lucide-react";

interface FormTransferProductPageProps {
    refetch: () => void
    onHiddenForm: () => void
    selectedId?: string,
    disabled: boolean,
    data?: TransferProduct,
}

const FormTransferProductPage: FC<FormTransferProductPageProps> = ({
    refetch,
    onHiddenForm,
    selectedId,
    disabled,
    data,
}) => {
    const [locationSelected, setLocationSelected] = useState<Locations[]>([]);

    const addTransferProduct = useCreateProductTransferMutation();
    const updateTransferProduct = useUpdateProductTransferMutation();
    const approveTransferProduct = useApproveProductTransferMutation();
    const rejectTransferProduct = useRejectProductTransferMutation();

    const { data: locationData, isPending: isPendingLocation } = useGetLocationQuery(100);

    const form = useForm<z.infer<typeof formTransferRequestSchema>>({
        resolver: zodResolver(formTransferRequestSchema),
        defaultValues: {
            from_location_id: data?.from_location_id.toString(),
            to_location_id: data?.to_location_id.toString(),
            request_note: data?.request_note,
            products: data?.product_transfer_service_details.map((x) => ({ id: x.id, product_id: x.product_id, quantity: x.quantity })),
        }
    });

    const onSubmit = (values: z.infer<typeof formTransferRequestSchema>) => {
        if (disableActionButton()) return;

        const formattedData = {
            ...values,
            id: selectedId,
            auto_approve: false
        } as unknown as TransferProductRequest;

        if (selectedId) {
            updateTransfer(formattedData)
        } else {
            createTransfer(formattedData)
        }
    }

    const updateTransfer = (formattedData: TransferProductRequest) => {
        updateTransferProduct.mutate(formattedData, {
            onSuccess: () => {
                refetch();
                form.reset();

                showToastSuccess("Berhasil Menambahkan Transfer Product");
                onHiddenForm();
            },
            onError: () => {
                form.reset();

                showToastError("Gagal Menambahkan Transfer Product");
                onHiddenForm();
            }
        });
    }

    const createTransfer = (formattedData: TransferProductRequest) => {
        addTransferProduct.mutate(formattedData, {
            onSuccess: () => {
                showToastSuccess("Berhasil Menambahkan Transfer Product");
                refetch();
                form.reset();
                onHiddenForm();
            },
            onError: () => {
                showToastError("Gagal Menambahkan Transfer Product");
                onHiddenForm();
                form.reset();
            }
        });
    }

    const onCancel = () => {
        form.reset();
        onHiddenForm();
    };

    const onApprove = () => {
        showConfirmationApprovalAlert('transfer', 'approve', () => {
            const values = {
                id: parseInt(selectedId || '0'),
                notes: 'Approved',
            };

            approveTransferProduct.mutate(values, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Setujui Transfer Produk");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Setujui Transfer Produk");
                }
            });
        })
    }

    const onReject = () => {
        showConfirmationApprovalAlert('transfer', 'reject', () => {
            const values = {
                id: parseInt(selectedId || '0'),
                notes: 'Reject',
            };

            rejectTransferProduct.mutate(values, {
                onSuccess: () => {
                    showToastSuccess("Berhasil menolak Transfer Produk");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal menolak Transfer Produk");
                }
            });
        })
    }

    if (isPendingLocation) {
        return <SkeletonFormPage />;
    }

    // Get Data checking
    const locations = locationData?.data ?? [];

    // Function to handle from location change
    const fromLocationChange = (value: string) => {
        form.setValue('from_location_id', value);
        // form.setValue('to_location_id', '');

        // const locationNotSelected = locations.filter((item: Locations) => item.id !== +value);
        // setLocationSelected(() => locationNotSelected);
    }

    const disableActionButton = () => {
        return addTransferProduct.isPending || updateTransferProduct.isPending ||
            approveTransferProduct.isPending || rejectTransferProduct.isPending
    }

    const labelButton = () => {
        if (disableActionButton()) {
            return 'Memproses...'
        }

        if (selectedId) {
            return 'Ubah'
        }

        return 'Tambah'
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
                            name="request_note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Catatan</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Masukkan Catatan"
                                            disabled={disabled}
                                            {...field}
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Row 2 */}
                        <FormField
                            control={form.control}
                            name="from_location_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dari Lokasi</FormLabel>
                                    <Select
                                        onValueChange={fromLocationChange}
                                        disabled={disabled}
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
                                        disabled={disabled}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Lokasi Tujuan" />
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
                    <FieldTransferProduct
                        form={form}
                        disabled={disabled || disableActionButton()}
                        data={data}
                    />
                    <div className='flex gap-4'>
                        {
                            !disabled && <Button className='w-[150px]' disabled={disableActionButton()}>
                                {labelButton()}
                            </Button>
                        }
                        {
                            !disabled && <Button className='w-[150px]' onClick={onApprove} variant="outline" type='button' disabled={disableActionButton()}>
                                <Check className="w-4 h-4 mr-1" style={{ color: 'green' }} /> Setuju
                            </Button>
                        }
                        {
                            !disabled && <Button className='w-[150px]' onClick={onReject} variant="outline" type='button' disabled={disableActionButton()}>
                                <Ban className="w-4 h-4 mr-1" style={{ color: 'red' }} /> Tolak
                            </Button>
                        }
                        <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button' disabled={disableActionButton()}>
                            Batal
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default FormTransferProductPage;