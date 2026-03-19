"use client"

import { formCustomerCategorySchema } from "@/app/api/people/pelanggan/kategori-pelanggan/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { UseMutationResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AxiosResponse } from "axios";
import { CustomerCategories, CustomerCategoriesResetAtEnum, CustomerCategoryRules, RequestCustomerCategories } from "@/app/api/people/pelanggan/kategori-pelanggan/type";

export type APIResponse<T> = T;

interface FormCustomerCategoryProps {
	customerCategories: CustomerCategories | null,
	customerCategoryRules: CustomerCategoryRules | null,
	mutation: UseMutationResult<AxiosResponse<any, any>, Error, CustomerCategories, unknown>,
	onSuccess: () => void,
	onError: () => void,
	onCancel: () => void,
}

const FormCustomerCategoryPage: FC<FormCustomerCategoryProps> = (props) => {
	const data = props.customerCategories;

	const form = useForm<z.infer<typeof formCustomerCategorySchema>>({
		resolver: zodResolver(formCustomerCategorySchema),
		defaultValues: {
			name: data?.name ?? '',
			required: data?.required ?? false,
			reset_every: data?.reset_every ?? CustomerCategoriesResetAtEnum.DAILY,
			customer_category_rule: props.customerCategoryRules ?? undefined,
		}
	});

	const onSubmit = (values: z.infer<typeof formCustomerCategorySchema>) => {
		if (props.mutation.isPending) return;

		const dataForm = {
			...values,
			id: data?.id,
		} as unknown as RequestCustomerCategories;

		props.mutation.mutate(dataForm, {
			onSuccess: () => {
				props.onSuccess();
			},
			onError: () => {
				props.onError();
			}
		});
	}

	const onCancel = () => {
		form.reset();
		props.onCancel()
	};

	return (
		<div>
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
												value={ (field.value) || ''}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="customer_category_rule.minimal_spend"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Minimal pembelian</FormLabel>
										<FormControl>
											<Input
												placeholder="Minimal pembelian"
												type='number'
												// { ...register('myNumberField', { valueAsNumber: true } ) }
												{...field }
												value={ Number(field.value) || 0 }
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className='flex gap-4'>
							<Button className='w-[150px]'>
								{props.mutation.isPending ? 'Processing...' : 'Simpan'}
							</Button>
							<Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>
								Batal
							</Button>
						</div>
					</form>
				</Form>
			</div>
	)
}

export default FormCustomerCategoryPage;