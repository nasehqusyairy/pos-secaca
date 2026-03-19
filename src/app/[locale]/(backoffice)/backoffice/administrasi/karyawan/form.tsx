"use client"

import { useCreateEmployeeMutation, useUpdateEmployeeMutation } from "@/app/api/karyawan/mutation";
import { formEmployeeSchema } from "@/app/api/karyawan/schema";
import { useGetRolesQuery } from "@/app/api/roles/queries";
import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { capitalizeWords } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FieldLocation from "./form-location";
import { useGetLocationQuery } from "@/app/api/locations/queries";
import { Employee, EmployeeRequest } from "@/app/api/karyawan/type";
import { Roles } from "@/app/api/roles/type";

interface FormEmployeePageProps {
    data: Employee | null,
    refetch: () => void
    onHiddenForm: () => void
}
 
const FormEmployeePage: FC<FormEmployeePageProps> = ({
    data,
    refetch,
    onHiddenForm
}) => {

    const addEmployee = useCreateEmployeeMutation();
    const updateEmployee = useUpdateEmployeeMutation();
    
    const {data: rolesData, isPending: isPendingRoles} = useGetRolesQuery({show_system: true});
    const {data: locationData, isPending: isPendingLocation} = useGetLocationQuery(100);

    const form = useForm<z.infer<typeof formEmployeeSchema>>({
        resolver: zodResolver(formEmployeeSchema)
    });

    // Function to set form values based on data
    const setFormValues = (data: Employee) => {
        form.getValues('first_name') ?? form.setValue('first_name', data.first_name);
        form.getValues('last_name') ?? form.setValue('last_name', data.last_name);
        form.getValues('email') ?? form.setValue('email', data.email);
        form.getValues('role_id') ?? form.setValue('role_id', data.role_id.toString());
        form.getValues('locations') ?? form.setValue('locations', data.locations);
    };

    // Check if data is exist
    let isEdit = false;
    if(data?.id) {
        isEdit = true;
        setFormValues(data);
    }

    const onSubmit = (values: z.infer<typeof formEmployeeSchema>) => {
		if (addEmployee.isPending || updateEmployee.isPending) return;

        
		const formattedData = {
		  ...values,
          select_all_location: false
		} as unknown as EmployeeRequest;
		
        if(isEdit) formattedData.id = data?.id ?? 0;

        // const valueForm = removeNullOrUndefined(dataForm);
        
        if(!isEdit){
            addEmployee.mutate(formattedData, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Create Employee");
                    refetch();
                    form.reset();
                    onHiddenForm();
                },
                onError: () => {
                    showToastError("Gagal Create Employee");
                    onHiddenForm();
                    form.reset();
                }
            });
        } else {
            updateEmployee.mutate(formattedData, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Employee");
                    refetch();
                    form.reset();
                    onHiddenForm();
                },
                onError: () => {
                    showToastError("Gagal Update Employee");
                    onHiddenForm();
                    form.reset();
                }
            });
        }
    }

	const onCancel = () => {
		form.reset();
		onHiddenForm();
	};

    if (isPendingRoles || isPendingLocation) {
		return <SkeletonFormPage />;
    }

    // Get Data checking
    const roles = rolesData?.data ?? [];
    const locations = locationData?.data ?? [];
    
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
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama depan</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan Nama depan"
                                                {...field}
                                                value={field.value}
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
                                    <FormItem>
                                        <FormLabel>Nama belakang</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan Nama belakang"
                                                {...field}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Row 2 */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan email"
                                                {...field}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
								control={form.control}
								name="role_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{roles.map(
													(
														item: Roles,
														i: number
													) => (
														<SelectItem
															key={item.id}
															value={item.id.toString()}
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
                            {/* Roles */}
                            <FieldLocation form={form} locations={locations} roles={roles} data={data}/>

                        </div>
                        <div className='flex gap-4'>
						    <Button className='w-[150px]'>
                                {addEmployee.isPending || updateEmployee.isPending ? 'Processing...' : !isEdit ? 'Tambah' : 'Update'}
                            </Button>
                            <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>cancel</Button>
                        </div>
                    </form>
            </Form>
        </div>
     );
}
 
export default FormEmployeePage;