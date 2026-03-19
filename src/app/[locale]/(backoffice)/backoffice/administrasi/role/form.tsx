"use client"

import { useCreateRolesMutation, useUpdateRolesMutation } from "@/app/api/roles/mutation";
import { useGetParentRolesQuery } from "@/app/api/roles/queries";
import { formRoleSchema } from "@/app/api/roles/schema";
import { RequestRoles, Roles } from "@/app/api/roles/type";
import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { capitalizeWords } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const itemsBrand = [
    { id: "index", name: 'Index', value: false },
    { id: "show", name: 'Show', value: false },
    { id: "create", name: 'Create', value: false },
    { id: "update", name: 'Update', value: false },
    { id: "destroy", name: 'Destroy', value: false },
    { id: "archive", name: 'Archive', value: false },
    { id: "activate", name: 'Activate', value: false },
]

interface FieldBrandPermissionProps {
    data: any,
    form: any  
}

const FieldBrandPermission: FC<FieldBrandPermissionProps> = ({
    data,
    form
} ) => {
    const [valueBrand, setValueBrand] = useState(itemsBrand);

    useEffect(() => {
        if(data){
            const value =  valueBrand.map((item) => {
                    if(data[item.id]){
                        return { ...item, value: data[item.id] };
                    }
                    return { ...item, value: false }
                }
            );
    
            setValueBrand(value);
        } 
    }, [data]);

    const handleChange = (id: string) => {
        
        const newValue = valueBrand.map((item) => {
            if (item.id === id) {
                return { ...item, value: !item.value };
            }
            return item;
        });
        setValueBrand(() => newValue);

        const formValue = newValue.map((item) => {
            return {
                [item.id]: item.value
            }
        })
        const result = formValue.reduce((acc, obj) => {
            const key = Object.keys(obj)[0];
            acc[key] = obj[key];
            return acc;
        }, {});

        const getValue = form.getValues('entity_permission');
        form.setValue('entity_permission',  {
            brand: result,
            ...getValue
        });
    };

    return (
        <FormField
        control={form.control}
        name="entity_permission"
        render={() => (
            <FormItem>
            <div className="mb-4">
                <FormLabel className="text-base">Entity Permission</FormLabel>
                <FormDescription>
                    Set permission for each entity
                </FormDescription>
            </div>
            {valueBrand.map((item) => (
                <FormField
                key={item.id}
                control={form.control}
                name="name"
                render={() => {
                    return (
                    <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                    >
                        <FormControl>
                        <Checkbox
                            checked={item.value}
                            onCheckedChange={() => {
                                return handleChange(item.id);
                            }}
                        />
                        </FormControl>
                        <FormLabel className="font-normal">
                        {item.name}
                        </FormLabel>
                    </FormItem>
                    )
                }}
                />
            ))}
            <FormMessage />
            </FormItem>
        )}
        />
    );
}

interface RolesFormPageProps {
    data: Roles | null,
    refetch: () => void
    onHiddenForm: () => void
}

const RolesFormPage: FC<RolesFormPageProps> = ({
    data,
    refetch,
    onHiddenForm
}) => {
    const addRoles = useCreateRolesMutation();
    const updateRole = useUpdateRolesMutation();

	const {data: parentRoleData, isPending: isPendingParentRole} = useGetParentRolesQuery();

    const form = useForm<z.infer<typeof formRoleSchema>>({
        resolver: zodResolver(formRoleSchema),
        defaultValues: {
            name: data?.name ?? '',
            parent_id: data?.parent_id.toString() ?? '',
            entity_permission: {},
            location_permission: {},
        }
    });

    // Check if data is exist
    let isEdit = false;
    if(data?.id) {
        isEdit = true;
    }

    const onSubmit = (values: z.infer<typeof formRoleSchema>) => {
        if (addRoles.isPending || updateRole.isPending) return;

        const dataForm = {
            ...values,
        } as unknown as RequestRoles;
        
        if(isEdit) dataForm.id = data?.id ?? 0;

        if(!isEdit){
            addRoles.mutate(dataForm, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Create Role");
                    refetch();
                    form.reset();
                    onHiddenForm();
                },
                onError: () => {
                    showToastError("Gagal Create Role");
                    onHiddenForm();
                    form.reset();
                }
            });
        } else {
            updateRole.mutate(dataForm, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Role");
                    refetch();
                    form.reset();
                    onHiddenForm();
                },
                onError: () => {
                    showToastError("Gagal Update Role");
                    onHiddenForm();
                    form.reset();
                }
            });
        }
    }

    const onCancel = () => {
        onHiddenForm();
    }

    if (isPendingParentRole) {
		return <SkeletonFormPage />;
    }

    // Check if data is exist
	const parentRole: Roles[] = parentRoleData?.data || [];
    
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
                                                placeholder="Masukkan Nama"
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
                                name="parent_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Parent Roles</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value || ''}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan parent role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{parentRole.map(
													(
														item: Roles,
														i: number
													) => (
														<SelectItem
															key={item.id}
															value={item?.id?.toString() || ''}
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
                            
                            {/* <FieldBrandPermission data={brandData} form={form} /> */}
                            {/* Image */}
                            {/* <div>
                                <FormLabel className='block mb-4'>
                                    Icon Image
                                </FormLabel>
                                <CustomUpload form={form} name="icon_image_url" />
                            </div> */}
                        </div>
                        <div className='flex gap-4'>
						    <Button className='w-[150px]'>
                                {addRoles.isPending || updateRole.isPending ? 'Processing...' : !isEdit ? 'Tambah' : 'Update'}
                            </Button>
                            <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>cancel</Button>
                        </div>
                    </form>
            </Form>
        </div>
     );
}
 
export default RolesFormPage;