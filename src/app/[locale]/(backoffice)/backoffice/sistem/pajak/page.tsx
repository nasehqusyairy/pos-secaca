"use client"

import { useGetTaxesQuery } from "@/app/api/taxes/queries";
import { FC, useState } from "react";
import { TaxesColumns, TaxesColumnShow } from "./column";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import SkeletonDataTable from "@/components/organisms/Skeleton/SkeletonDataTable";
import { TaxTable } from "./table";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showConfirmationDeleteAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { useCreateTaxesMutation, useUpdateTaxesMutation } from "@/app/api/taxes/mutation";
import { TaxesFormSchema } from "@/app/api/taxes/schema";
import { Taxes } from "@/app/api/taxes/type";

interface PajakPageProps {
    
}
 
const PajakPage: FC<PajakPageProps> = () => {
    const [editingRowId, setEditingRowId] = useState<number | string | null>(null);
    
    const {data, isPending, refetch} = useGetTaxesQuery(100);
    const addTaxes = useCreateTaxesMutation();
    const updateTaxes = useUpdateTaxesMutation();

    const form = useForm<z.infer<typeof TaxesFormSchema>>({
        resolver: zodResolver(TaxesFormSchema)
    });

    function handleEdit(row: Taxes) {
        setEditingRowId(row.id)
        form.setValue('name', row.name)
        form.setValue('rate', row.rate.toString())
        form.setValue('id', row.id)
    }

    function handleDelete(row: Taxes) {
        showConfirmationDeleteAlert(row.name, row.status, () => {
            const values = {
                id: row.id,
                status: row.status === 'active' ? 'archived' : 'active'
            }

            updateTaxes.mutate(values as Taxes, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Pajak");
                    refetch();
                    form.reset();
                    setEditingRowId(null);
                },
                onError: () => {
                    showToastError("Gagal Update Pajak");
                    setEditingRowId(null);
                    form.reset();
                }
            });
        })
    }

    function onSubmit(values: z.infer<typeof TaxesFormSchema>) {
        if (addTaxes.isPending || updateTaxes.isPending) return;

        const data = {
            ...values,
            rate: +values.rate
        } as Taxes;

        if(editingRowId == 'tambah'){
            addTaxes.mutate(data, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Create Pajak");
                    refetch();
                    form.reset();
                    setEditingRowId(null);
                },
                onError: () => {
                    showToastError("Gagal Create Pajak");
                    setEditingRowId(null);
                    form.reset();
                }
            });
        } else {
            updateTaxes.mutate(data, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Pajak");
                    refetch();
                    form.reset();
                    setEditingRowId(null);
                },
                onError: () => {
                    showToastError("Gagal Update Pajak");
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
        setEditingRowId("tambah")
        form.setValue("rate", '0')
    }

    const columns = TaxesColumns({ onEdit: handleEdit, onDelete: handleDelete });

    if (isPending) {
        return  (
        <div>
                <PageTitleSetting title="Pajak" subtitle="Atur Pajak"></PageTitleSetting>
                <SkeletonDataTable />
            </div>);
    }


    return ( 
        <>
            <div>
                <PageTitleSetting title="Pajak" subtitle="Atur Pajak"></PageTitleSetting>
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
                <TaxTable columnShow={TaxesColumnShow} columns={columns} data={data?.data} editingRowId={editingRowId} onAdd={onAdd}>
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
                                name="rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Besaran (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan Besaran (%)"
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
                                {addTaxes.isPending || updateTaxes.isPending ? 'Processing...' : editingRowId == 'tambah' ? 'Tambah' : 'Ubah'}
                            </Button>
                            <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Batal</Button>
                        </div>
                    </form>
                </Form>
                </TaxTable>
            </div>
        </>
    )
}

 
export default PajakPage;