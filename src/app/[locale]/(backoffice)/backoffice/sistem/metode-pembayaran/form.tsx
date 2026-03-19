"use client"

import { useCreatePaymentMethodMutation, useUpdatePaymentMethodMutation } from "@/app/api/payment-method/mutation";
import { PaymentMethodFormSchema } from "@/app/api/payment-method/schema";
import { PaymentMethods } from "@/app/api/payment-method/type";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAYMENT_METHOD_KIND } from "@/lib/constant";
import { capitalizeWords } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormPaymentMethodPageProps {
    data: PaymentMethods | null,
    refetch: () => void
    onHiddenForm: () => void
}
 
const FormPaymentMethodPage: FC<FormPaymentMethodPageProps> = ({
    data,
    refetch,
    onHiddenForm
}) => {
    const addPaymentMethod = useCreatePaymentMethodMutation();
    const updatePaymentMethod = useUpdatePaymentMethodMutation();

    const form = useForm<z.infer<typeof PaymentMethodFormSchema>>({
        resolver: zodResolver(PaymentMethodFormSchema),
        defaultValues: {
            name: data?.name ?? '',
            kind: data?.kind ?? 'cash',
            fixed_fee: data?.fixed_fee ? data.fixed_fee.toString() : '0',
            variable_fee: data?.variable_fee ? data.variable_fee.toString() : '0'
        }
    });

    // Check if data is exist
    let isEdit = false;
    if(data?.id) {
        isEdit = true;
        form.setValue('icon_image_url', data.icon_image_url);
    }

    const onSubmit = (values: z.infer<typeof PaymentMethodFormSchema>) => {
        if (addPaymentMethod.isPending || updatePaymentMethod.isPending) return;

        const dataForm = {
            ...values,
            fixed_fee: parseFloat(values.fixed_fee),
            variable_fee: parseFloat(values.variable_fee),
        } as unknown as PaymentMethods;
        
        if(isEdit) dataForm.id = data?.id ?? 0;

        if(!isEdit){
            addPaymentMethod.mutate(dataForm, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Create Metode Pembayaran");
                    form.reset();
                    refetch();
                    onHiddenForm();
                },
                onError: () => {
                    showToastError("Gagal Create Metode Pembayaran");
                    form.reset();
                    onHiddenForm();
                }
            });
        } else {
            updatePaymentMethod.mutate(dataForm, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Metode Pembayaran");
                    form.reset();
                    refetch();
                    onHiddenForm();
                },
                onError: () => {
                    showToastError("Gagal Update Metode Pembayaran");
                    form.reset();
                    onHiddenForm();
                }
            });
        }
    }

    const onCancel = () => {
        onHiddenForm();
    }

    return ( 
        <div >
            <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan nama"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
								control={form.control}
								name="kind"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Jenis Metode Pembayaran</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan jenis Metode Pembayaran" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{PAYMENT_METHOD_KIND.map(
													(
														item: string,
														i: number
													) => (
														<SelectItem
															key={item + i}
															value={item}
														>
															{capitalizeWords(item)}
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
                                name="fixed_fee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Biaya tetap (Rp)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan Biaya tetap (Rp)"
                                                {...field}
                                                value={field.value || '0'}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="variable_fee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Biaya (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan Biaya (%)"
                                                {...field}
                                                value={field.value || '0'}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Image */}
                            {/* <div>
                                <FormLabel className='block mb-4'>
                                    Icon Gambar
                                </FormLabel>
                                <CustomUpload form={form} name="icon_image_url" />
                            </div> */}
                        </div>
                        <div className='flex gap-4'>
						    <Button className='w-[150px]'>
                                {addPaymentMethod.isPending || updatePaymentMethod.isPending ? 'Processing...' : !isEdit ? 'Tambah' : 'Update'}
                            </Button>
                            <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Batal</Button>
                        </div>
                    </form>
            </Form>
        </div>
     );
}
 
export default FormPaymentMethodPage;