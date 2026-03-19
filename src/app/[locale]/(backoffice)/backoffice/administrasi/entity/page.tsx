"use client"

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";

import {
      Form,
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
  } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


import { z } from 'zod';
import FieldInput from '@/components/molecules/FieldInput';
import CustomUpload from '@/components/molecules/UploadImage';
import PageTitleSetting from '@/components/molecules/settings/PageTitleSetting';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form";
import { EntityFormSchema } from '@/app/api/entity/schema';
import { useGetEntityQuery } from '@/app/api/entity/queries';
import { showToastError, showToastSuccess } from '@/components/templates/SweetAlert';
import { useUpdateEntityMutation } from '@/app/api/entity/mutation';
import SkeletonEntityPage from '@/components/organisms/Skeleton/SkeletonEntityPage';
import { useSession } from 'next-auth/react';
import { Entity } from '@/app/api/entity/type';

function EntityPage() {
    const session = useSession();

    const [isEdit, setIsEdit] = useState(false);

    const entity = session?.data?.user?.selected_entity as Entity;

    const { data, isPending, refetch } = useGetEntityQuery(entity?.id ?? 0);
    const updateEntity = useUpdateEntityMutation();

    const form = useForm<z.infer<typeof EntityFormSchema>>({
        resolver: zodResolver(EntityFormSchema)
    });

    const setFormValues = (entity: Entity) => {
        const {
            id,
            name,
            image_url,
            icon_image_url,
            code,
            initial,
            phone_number_country_code,
            phone_number,
            email,
            website,
            full_address,
            city,
            province,
            postal_code,
            status
        } = entity;

        form.setValue('id', id);
        form.setValue('name', name);
        form.setValue('image_url', image_url);
        form.setValue('icon_image_url', icon_image_url);
        form.setValue('code', code);
        form.setValue('initial', initial);
        form.setValue('phone_number_country_code', phone_number_country_code);
        form.setValue('phone_number', phone_number);
        form.setValue('email', email);
        form.setValue('website', website);
        form.setValue('full_address', full_address);
        form.setValue('city', city);
        form.setValue('province', province);
        form.setValue('postal_code', postal_code);
        form.setValue('status', status);
    };

    const onSubmit = (data: z.infer<typeof EntityFormSchema>) => {
        if (updateEntity.isPending) return;

        updateEntity.mutate(data as Entity, {
            onSuccess: () => {

                showToastSuccess("Berhasil Update Entity");
                refetch();
                setIsEdit(false);
            },
            onError: () => {
                showToastError("Gagal Update Entity");
                setIsEdit(false);
            }
        });
    };

    useEffect(() => {
        if (data && !isEdit) {
            const entity = data?.data as Entity;
            setFormValues(entity);
        }
    }, [data, isEdit]);

    const toggleEdit = () => {
        setIsEdit(prev => !prev);
        form.clearErrors();
    };

    if (isPending) {
        return <SkeletonEntityPage />
    }


  return (
    <div className="mt-10">
        <div className="mb-10">
			<PageTitleSetting title="Entity" subtitle="Manage your entity here"></PageTitleSetting>
            {/* <BreadCrumSetting data={[
				{
					title: 'settings',
					link: '#',
				},
				{
					title: 'Entity',
					link: '#',
				}
			]} /> */}
        </div>

        <Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-5 space-y-6 pt-6"
				>
					<FieldInput
						title="Entities Setting"
						subtitle="Manage your entity here"
					>
						<div className="space-y-5">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Entity Name</FormLabel>
									<FormControl>
										<Input
											className="w-[450px]"
											placeholder="Enter your entity name"
											{...field}
                                            value={field.value || ''}
                                            disabled={!isEdit}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Image */}
                        <FormLabel className='block'>
                            Entity Image
                        </FormLabel>
                        <CustomUpload form={form} name="image_url" />
                        {/* Icon */}
                        <FormLabel className='block'>
                            Entity Icon
                        </FormLabel>
                        <CustomUpload form={form} name="icon_image_url" />
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Entity Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-[450px]"
                                            placeholder="Enter your entity code"
                                            {...field}
                                            value={field.value || ''}
                                            disabled={!isEdit}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="initial"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Entity Initial</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-[450px]"
                                            placeholder="Enter your entity initial"
                                            {...field}
                                            value={field.value || ''}
                                            disabled={!isEdit}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormLabel className='block'>
                            Phone Number
                        </FormLabel>
                        <div className="w-[450px] flex flex-row justify-between items-center gap-4">
                            {/*code number and phone number */}
                            <FormField
                            control={form.control}
                            name="phone_number_country_code"
                            render={({ field }) => (
                                <FormItem className='w-[20%]'>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder="62"
                                            {...field}
                                            type="number"
                                            value={field.value || ''}
                                            disabled={!isEdit}
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
                                            className="w-full"
                                            placeholder="Enter your phone number"
                                            type="number"
                                            {...field}
                                            value={field.value || ''}
                                            disabled={!isEdit}
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
                                <FormItem>
                                    <FormLabel>Entity Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-[450px]"
                                            placeholder="Enter your entity email"
                                            {...field}
                                            value={field.value || ''}
                                            disabled={!isEdit}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Entity Website</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-[450px]"
                                            placeholder="Enter your entity website"
                                            {...field}
                                            value={field.value || ''}
                                            disabled={!isEdit}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="full_address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-[450px]"
                                            placeholder="Enter your full address"
                                            {...field}
                                            value={field.value || ''}
                                            disabled={!isEdit}
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
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-[450px]"
                                            placeholder="Enter your city"
                                            {...field}
                                            value={field.value || ''}
                                            disabled={!isEdit}
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
                                    <FormLabel>Province</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-[450px]"
                                            placeholder="Enter your province"
                                            {...field}
                                            value={field.value || ''}
                                            disabled={!isEdit}
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
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-[450px]"
                                            placeholder="Enter your postal code"
                                            {...field}
                                            value={field.value || ''}
                                            disabled={!isEdit}
                                        />
                                    </FormControl>
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
                                    <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value || ''}
                                            disabled={!isEdit}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="active" id="active" />
                                            <Label htmlFor="active">Active</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="archived" id="archived" />
                                            <Label htmlFor="archived">Archived</Label>
                                        </div>
                                    </RadioGroup>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className='grid grid-cols-3 gap-4'>
                            {
                                isEdit ? 
                                <Button variant="secondary" onClick={toggleEdit} type='button'>Cancel</Button>
                                : <Button variant="outline" onClick={toggleEdit} type='button'>Edit</Button>
                            }
						    <Button className='col-span-2' disabled={!isEdit}>
                                {updateEntity.isPending ? 'Processing...' : 'Update'}
                            </Button>
                        </div>

						</div>
					</FieldInput>
                    
                </form>
            </Form>

    </div>
  )
}

export default EntityPage

