"use client"

import { useGetOrderTypeQuery } from "@/app/api/order-type/queries";
import { FC, useState } from "react";
import { OrderTypeColumns, OrderTypeColumnShow } from "./column";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import SkeletonDataTable from "@/components/organisms/Skeleton/SkeletonDataTable";
import { OrderTypeTable } from "./table";
import { showConfirmationDeleteAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateOrderTypeMutation, useUpdateOrderTypeMutation } from "@/app/api/order-type/mutation";
import { orderTypeFormSchema } from "@/app/api/order-type/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetPaymentMethodQuery } from "@/app/api/payment-method/queries";
import { OrderTypes } from "@/app/api/order-type/type";
import { PaymentMethods } from "@/app/api/payment-method/type";

interface OrderTypePageProps {}
 
const OrderTypePage: FC<OrderTypePageProps> = () => {
    const [editingRowId, setEditingRowId] = useState<number | string | null>(null);
    
    const {data, isPending, refetch} = useGetOrderTypeQuery(100);
    const {data: paymentMethodData, isPending: isPendingPaymentMethod} = useGetPaymentMethodQuery();
    const addOrderType = useCreateOrderTypeMutation();
    const updateOrderType = useUpdateOrderTypeMutation();

    const form = useForm<z.infer<typeof orderTypeFormSchema>>({
        resolver: zodResolver(orderTypeFormSchema)
    });

    function handleEdit(row: OrderTypes) {
        setEditingRowId(row.id)
        form.setValue('id', row.id)
        form.setValue('name', row.name)
        form.setValue('fixed_fee', row.fixed_fee.toString())
        form.setValue('variable_fee', row.variable_fee.toString())
        form.setValue('require_customer_data', row.require_customer_data ? 'yes' : 'no')
        form.setValue("payment_method_id", row.payment_method_id?.toString())
    }

    function handleDelete(row: OrderTypes) {
        showConfirmationDeleteAlert(row.name, row.status, () => {
            const values = {
                id: row.id,
                status: row.status === 'active' ? 'archived' : 'active'
            }

            updateOrderType.mutate(values as OrderTypes, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Jenis Pesanan");
                    refetch();
                    form.reset();
                    setEditingRowId(null);
                },
                onError: () => {
                    showToastError("Gagal Update Jenis Pesanan");
                    setEditingRowId(null);
                    form.reset();
                }
            });
        })
    }

    function onSubmit(values: z.infer<typeof orderTypeFormSchema>) {
        if (addOrderType.isPending || updateOrderType.isPending) return;

        const data = {
            name: values.name,
            fixed_fee: +values.fixed_fee,
            variable_fee: +values.variable_fee,
            require_customer_data: values.require_customer_data === 'yes' ? true : false
        } as OrderTypes;
        
        if(values.payment_method_id) {
            data.payment_method_id = +values.payment_method_id
        }
        
        if(editingRowId == 'tambah'){
            addOrderType.mutate(data, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Create Jenis Pesanan");
                    refetch();
                    form.reset();
                    setEditingRowId(null);
                },
                onError: () => {
                    showToastError("Gagal Create Jenis Pesanan");
                    setEditingRowId(null);
                    form.reset();
                }
            });
        } else {
            const id = values.id
            if (id) data.id = +id 
            
            updateOrderType.mutate(data, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Jenis Pesanan");
                    refetch();
                    form.reset();
                    setEditingRowId(null);
                },
                onError: () => {
                    showToastError("Gagal Update Jenis Pesanan");
                    setEditingRowId(null);
                    form.reset();
                }
            });
        }
    }

    function onCancel(){
        setEditingRowId(null)
        form.reset()
    }

    function onAdd() {
        setEditingRowId("tambah");
        form.setValue('fixed_fee', '0');
        form.setValue('variable_fee', '0');
    }

    const columns = OrderTypeColumns({ onEdit: handleEdit, onDelete: handleDelete });

    // helper method get payment method
    const getIdPaymentMethod = (data: PaymentMethods) => {
        return data.id ? data.id.toString() : ''
    }

    if (isPending || isPendingPaymentMethod) {
        return  (
        <div>
                <PageTitleSetting title="Jenis Pesanan" subtitle="Atur Jenis Pesanan"></PageTitleSetting>
                <SkeletonDataTable />
            </div>);
    }

    return ( 
        <>
            <div>
                <PageTitleSetting title="Jenis Pesanan" subtitle="Atur Jenis Pesanan"></PageTitleSetting>
                {/* <BreadCrumSetting data={[
                    {
                        title: 'Administrasi',
                        link: '#',
                    },
                    {
                        title: 'Brand',
                        link: '#',
                    }
                ]} /> */}
            </div>

            <div className="container mx-auto py-10">
                <OrderTypeTable columnShow={OrderTypeColumnShow} columns={columns} data={data?.data} editingRowId={editingRowId} onAdd={onAdd}>
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
                                name="payment_method_id"
                                render={({ field }) => (
                                    <FormItem>
										<FormLabel>Metode Pembayaran</FormLabel>
										<Select
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Pilih Metode Pembayaran" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
                                                {
                                                    paymentMethodData?.data.map((data: PaymentMethods) => (

                                                        <SelectItem key={data.id} value={getIdPaymentMethod(data)}>
                                                            {data.name}
                                                        </SelectItem>
                                                    ))
                                                }
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
                                        <FormLabel>Biaya Tetap (Rp)</FormLabel>
                                        <FormControl>
                                            <Input                                     
                                                placeholder="Masukkan Biaya Tetap (Rp)"
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
                                name="require_customer_data"
                                render={({ field }) => (
                                    <FormItem>
										<FormLabel>Data Member</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={'yes'}
                                            value={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Choose Order type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
                                                <SelectItem key={0} value={'yes'}>
                                                    Iya
                                                </SelectItem>
                                                <SelectItem key={1} value={'no'}>
                                                    Tidak
                                                </SelectItem>
											</SelectContent>
										</Select>
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
                                                value={field.value || ''}
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div className='flex gap-4'>
						    <Button className='w-[150px]'>
                                {addOrderType.isPending || updateOrderType.isPending ? 'Processing...' : editingRowId == 'tambah' ? 'Tambah' : 'Ubah'}
                            </Button>
                            <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Batal</Button>
                        </div>
                    </form>
                </Form>
                </OrderTypeTable>
            </div>
        </>
    )
}
 
export default OrderTypePage;