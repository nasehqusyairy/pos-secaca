"use client"

import { FC, useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
  } from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/order";
import { CustomerSchema } from "@/app/api/catalogues/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useGetCustomerByKeywordQuery } from "@/app/api/customer/queries";
import { useAddCustomerMutation } from "@/app/api/customer/mutation";
import { showToastError } from "@/components/templates/SweetAlert";

interface CustomerPageProps {
    isTriggerOpen: boolean;
    location_id: number;
    onClose: () => void;
    onSubmit: (customer: Customer) => void
}
 
const CustomerPage: FC<CustomerPageProps> = ({
    isTriggerOpen,
    location_id,
    onClose,
    onSubmit
}) => {
    const [pelanggan, setPelanggan] = useState<Customer | null>();
    const [state, setState] = useState<string>('DEFAULT');
    const [isForm, setIsForm] = useState<boolean>(false);
    const inputSearch = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Store search term

    // Use the hook properly at the top level
    const { data: customerData, isPending } = useGetCustomerByKeywordQuery(searchTerm); 
    const addCustomer = useAddCustomerMutation()

    const form = useForm<z.infer<typeof CustomerSchema>>({
        resolver: zodResolver(CustomerSchema),
        defaultValues: {
            phone_number_country_code: '62',
            email: null,
        }
    });

    useEffect(() => {
        setState('DEFAULT');
        setIsForm(false);
        form.reset();
    }, [isTriggerOpen]);

    useEffect(() => {
        if (customerData) {
            if (customerData && customerData.length > 0) {
                const customer = customerData[0]
                setPelanggan({
                    id: customer.id,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    email: customer.email,
                    phone_number: customer.phone_number,
                    phone_number_country_code: customer.phone_number_country_code
                } as Customer)
            } else {
                setPelanggan(null)
            }
        }

    }, [customerData]);

    const onSearchCustomer = () => {
        const data = inputSearch?.current?.value;

        if(data){
            setSearchTerm(data)
            setState('SEARCH')
        }
    }

    const onSelectCustomer = () => {
        onSubmit(pelanggan as Customer)
        setPelanggan(null)
    }

    const addCustomerForm = () => {
        setIsForm(true);
    }
    
    const onSubmitForm = (values: z.infer<typeof CustomerSchema>) => {
        if (addCustomer.isPending) return;

        const payload = {
            ...values,
            location_id
        } as Customer
        addCustomer.mutate(payload, {
            onSuccess: () => { 
                onSubmit(payload);
            },
            onError: () => {
                showToastError("Gagal Membuat Member");
            }
        })
    }

    let message = <p className="py-10 text-xs md:text-base">Member tidak ditemukan</p>
    if (state === 'DEFAULT') {
        message = <p className="py-10 text-center text-xs md:text-base">Silahkan cari atau menambahkan member baru</p>
    }   
    if (state === 'SEARCH' && isPending) {
        message = <p className="py-10 text-xs md:text-base">Sedang mencari member</p>
    }

    return ( 
        <Dialog open={isTriggerOpen}>
            <DialogContent className={cn("bg-white w-96 rounded-md md:w-full [&>button]:hidden")}>
                <DialogTitle className="text-lg md:text-2xl font-semibold">Member</DialogTitle>
                <DialogDescription className="text-xs md:text-sm text-muted-foreground -mt-2">Masukkan member yang sedang melakukan pembelian.</DialogDescription>
                {
                    isForm ? (
                        <Form {...form}> 
                            <form onSubmit={form.handleSubmit(onSubmitForm)}>
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem className="mb-2">
                                            <FormLabel>Nama depan</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Masukkan nama depan"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    className="text-xs md:text-base w-[250px] md:w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem className="mb-2">
                                            <FormLabel className="text-xs md:text-base">Nama belakang</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Masukkan nama belakang"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    className="text-xs md:text-base w-[250px] md:w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormLabel className='block py-2 text-xs md:text-base'>
                                    Nomor handphone
                                </FormLabel>
                                <div className="w-[250px] md:w-[450px] flex flex-row justify-between items-center gap-1 md:gap-4">
                                    {/*code number and phone number */}
                                    <FormField
                                    control={form.control}
                                    name="phone_number_country_code"
                                    render={({ field }) => (
                                        <FormItem className='w-[20%]'>
                                            <FormControl>
                                                <Input
                                                    className="w-full text-xs md:text-base"
                                                    placeholder="62"
                                                    {...field}
                                                    type="number"
                                                    value={field.value || ''}
                                                    disabled={true}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="phone_number"
                                    render={({ field }) => (
                                        <FormItem className='w-[80%]'>
                                            <FormControl>
                                                <Input
                                                    className="w-full text-xs md:text-base"
                                                    placeholder="Masukkan nomor handphone"
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
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="mt-2">
                                            <FormLabel className="text-xs md:text-base">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Masukkan email"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    type="email"
                                                    className="text-xs md:text-base w-[250px] md:w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-2 mb-4 mt-8">
                                    <Button type="submit" className="text-xs md:text-base">Simpan member</Button>
                                    <Button variant="secondary" className="text-xs md:text-base" type="button" onClick={onClose}>Kembali</Button>
                                </div>
                            </form>
                        </Form>
                    ) : (
                        <div className="text-sm">
                        <div className="flex gap-2">
                            <input ref={inputSearch} placeholder="cari pelanggan ..." className="w-full border py-2 px-4 rounded-md bg-white text-xs md:text-base"/>
                            <Button type="button" className="text-xs md:text-base" onClick={onSearchCustomer}>Cari</Button>
                        </div>

                        {/* Pelanggan ditemukan */}
                        {
                            pelanggan ? (
                                <div className="mb-10 mt-4">
                                    <div className=" p-2 border-2 rounded-sm text-xs md:text-base">
                                        <strong>Member: </strong>
                                        <p>{pelanggan?.first_name} {pelanggan?.last_name}</p>
                                    </div>
                                    <div className="flex gap-2 justify-center mt-8">
                                        <Button type="button" className="text-xs md:text-base" onClick={onSelectCustomer}>Pilih Member</Button>
                                        <Button variant="secondary" className="text-xs md:text-base" onClick={onClose}>Kembali</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center mx-auto">
                                    {message}
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="border-primary text-primary text-xs md:text-base" onClick={addCustomerForm} disabled={addCustomer.isPending}>Tambah member</Button>
                                        <Button variant="secondary" className="text-xs md:text-base" onClick={onClose} disabled={addCustomer.isPending}>Kembali</Button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    )
                }
            </DialogContent>
        </Dialog>

     );
}
 
export default CustomerPage;