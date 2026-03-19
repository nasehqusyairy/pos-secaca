"use client"

import { useGetProductUnitQuery } from "@/app/api/product/queries";
import { FC, useState } from "react";
import { ProductUnitColumns, ProductUnitColumnShow } from "./column";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import SkeletonDataTable from "@/components/organisms/Skeleton/SkeletonDataTable";
import { ProductUnitTable } from "./table";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductUnitFormSchema } from "@/app/api/product/product-unit/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateProductUnitMutation, useUpdateProductUnitMutation } from "@/app/api/product/mutation";
import { showConfirmationDeleteAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { ProductUnits } from "@/app/api/product/product-unit/type";

interface ProdukUnitPageProps {
    
}

const ProdukUnitPage: FC<ProdukUnitPageProps> = () => {
    const [editingRowId, setEditingRowId] = useState<number | string | null>(null);
    
    const {data, isPending, refetch} = useGetProductUnitQuery(100);
    const addProductUnit = useCreateProductUnitMutation();
    const updateProductUnit = useUpdateProductUnitMutation();

    const form = useForm<z.infer<typeof ProductUnitFormSchema>>({
        resolver: zodResolver(ProductUnitFormSchema)
    });

    function handleEdit(row: ProductUnits) {
        setEditingRowId(row.id)
        form.setValue('name', row.name)
        form.setValue('id', row.id)
    }

    function handleDelete(row: ProductUnits) {
        showConfirmationDeleteAlert(row.name, row.status, () => {
            const values = {
                id: row.id,
                status: row.status === 'active' ? 'archived' : 'active'
            }

            updateProductUnit.mutate(values as ProductUnits, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Satuan");
                    refetch();
                    form.reset();
                    setEditingRowId(null);
                },
                onError: () => {
                    showToastError("Gagal Update Satuan");
                    setEditingRowId(null);
                    form.reset();
                }
            });
        })
    }

    function onSubmit(values: z.infer<typeof ProductUnitFormSchema>) {
        if (addProductUnit.isPending || updateProductUnit.isPending) return;

        if(editingRowId == 'tambah'){
            addProductUnit.mutate(values as ProductUnits, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Create Satuan");
                    refetch();
                    form.reset();
                    setEditingRowId(null);
                },
                onError: () => {
                    showToastError("Gagal Create Satuan");
                    setEditingRowId(null);
                    form.reset();
                }
            });
        } else {
            updateProductUnit.mutate(values as ProductUnits, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Satuan");
                    refetch();
                    form.reset();
                    setEditingRowId(null);
                },
                onError: () => {
                    showToastError("Gagal Update Satuan");
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
    }

    const columns = ProductUnitColumns({ onEdit: handleEdit, onDelete: handleDelete });

    if (isPending) {
        return  (
        <div>
                <PageTitleSetting title="Satuan" subtitle="Atur Satuan"></PageTitleSetting>
                <SkeletonDataTable />
            </div>);
    }

    return ( 
        <>
            <div>
                <PageTitleSetting title="Satuan" subtitle="Atur Satuan"></PageTitleSetting>
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
                <ProductUnitTable columnShow={ProductUnitColumnShow} columns={columns} data={data?.data} editingRowId={editingRowId} onAdd={onAdd}>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nama</FormLabel>
									<FormControl>
										<Input
											className="w-[450px]"
											placeholder="Masukkan nama"
											{...field}
                                            value={field.value || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
                        <div className='flex gap-4'>
						    <Button className='w-[150px]'>
                                {addProductUnit.isPending || updateProductUnit.isPending ? 'Processing...' : editingRowId == 'tambah' ? 'Tambah' : 'Update'}
                            </Button>
                            <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Batal</Button>
                        </div>
                    </form>
                </Form>
                </ProductUnitTable>
            </div>
        </>
    )
}
 
export default ProdukUnitPage;