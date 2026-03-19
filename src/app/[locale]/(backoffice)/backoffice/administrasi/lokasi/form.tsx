"use client"

import { useCreateLocationMutation, useUpdateLocationMutation } from "@/app/api/locations/mutation";
import { LocationFormSchema } from "@/app/api/locations/schema";
import { Locations } from "@/app/api/locations/type";
import CustomUpload from "@/components/molecules/UploadImage";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOCATION_KIND, STATUS_KIND } from "@/lib/constant";
import { capitalizeWords, removeNullOrUndefined } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormLocationPageProps {
    data: Locations | null,
    refetch: () => void
    onHiddenForm: () => void
}
 
const FormLocationPage: FC<FormLocationPageProps> = ({
    data,
    refetch,
    onHiddenForm
}) => {
    const addLocation = useCreateLocationMutation();
    const updateLocation = useUpdateLocationMutation();

    const form = useForm<z.infer<typeof LocationFormSchema>>({
        resolver: zodResolver(LocationFormSchema)
    });

    // Function to set form values based on data
    const setFormValues = (data: Locations) => {
        form.getValues('name') ?? form.setValue('name', data.name);
        form.getValues('backoffice_email') ?? form.setValue('backoffice_email', data.backoffice_email);
        form.getValues('contact_email') ?? form.setValue('contact_email', data.contact_email);
        form.getValues('backoffice_phone_number_country_code') ?? form.setValue('backoffice_phone_number_country_code', data.backoffice_phone_number_country_code);
        form.getValues('backoffice_phone_number') ?? form.setValue('backoffice_phone_number', data.backoffice_phone_number);
        form.getValues('image_url') ?? form.setValue('image_url', data.image_url);
        form.getValues('icon_image_url') ?? form.setValue('icon_image_url', data.icon_image_url);
        form.getValues('kind') ?? form.setValue('kind', data.kind);
        form.getValues('status') ?? form.setValue('status', data.status);
        form.getValues('full_address') ?? form.setValue('full_address', data.full_address);
        form.getValues('postal_code') ?? form.setValue('postal_code', data.postal_code);
        form.getValues('city') ?? form.setValue('city', data.city);
        form.getValues('province') ?? form.setValue('province', data.province);
        form.getValues('country') ?? form.setValue('country', data.country);
    };

    // Check if data is exist
    let isEdit = false;
    if(data?.id) {
        isEdit = true;
        setFormValues(data);
    }

    const onSubmit = (values: z.infer<typeof LocationFormSchema>) => {
        if (addLocation.isPending || updateLocation.isPending) return;

        const dataForm = {
            ...values,
        } as Locations;
        
        if(isEdit) dataForm.id = data?.id ?? 0;

        const valueForm = removeNullOrUndefined(dataForm);
        
        if(!isEdit){
            addLocation.mutate(valueForm, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Create Location");
                    refetch();
                    form.reset();
                    onHiddenForm();
                },
                onError: () => {
                    showToastError("Gagal Create Location");
                    onHiddenForm();
                    form.reset();
                }
            });
        } else {
            updateLocation.mutate(valueForm, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Location");
                    refetch();
                    form.reset();
                    onHiddenForm();
                },
                onError: () => {
                    showToastError("Gagal Update Location");
                    onHiddenForm();
                    form.reset();
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
                                name="backoffice_email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Backoffice Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan backoffice email"
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
                                name="contact_email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan contact email"
                                                {...field}
                                                value={field.value || ''}
                                                type="email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col gap-4">
                                <FormLabel>Nomor Telepon</FormLabel>
                                <div className="flex gap-4">
                                    {/*code number and phone number */}
                                    <FormField
                                    control={form.control}
                                    name="backoffice_phone_number_country_code"
                                    render={({ field }) => (
                                        <FormItem className='w-[20%]'>
                                            <FormControl>
                                                <Input
                                                    className="w-full"
                                                    placeholder="62"
                                                    {...field}
                                                    type="number"
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="backoffice_phone_number"
                                    render={({ field }) => (
                                        <FormItem className='w-[80%]'>
                                            <FormControl>
                                                <Input
                                                    className="w-full"
                                                    placeholder="Masukkan phone number"
                                                    type="number"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                            </div>
                            {/* Image */}
                            <div>
                                <FormLabel className='block mb-4'>
                                    Gambar
                                </FormLabel>
                                <CustomUpload form={form} name="image_url" />
                            </div>
                            {/* Image */}
                            <div>
                                <FormLabel className='block mb-4'>
                                    Icon Gambar
                                </FormLabel>
                                <CustomUpload form={form} name="icon_image_url" />
                            </div>
                            <FormField
								control={form.control}
								name="kind"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Jenis lokasi</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan Jenis lokasi" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{LOCATION_KIND.map(
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
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{STATUS_KIND.map(
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
                                name="full_address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alamat</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan Alamat"
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
                                name="postal_code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kode Pos</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan Kode Pos"
                                                {...field}
                                                value={field.value || ''}
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kota</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan Kota"
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
                                name="province"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Provinsi</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan Provinsi"
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
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Negara</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan Negara"
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
                                name="footer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Footer</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan Footer"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex gap-4'>
						    <Button className='w-[150px]'>
                                {addLocation.isPending || updateLocation.isPending ? 'Processing...' : !isEdit ? 'Tambah' : 'Ubah'}
                            </Button>
                            <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Batal</Button>
                        </div>
                    </form>
            </Form>
        </div>
     );
}
 
export default FormLocationPage;