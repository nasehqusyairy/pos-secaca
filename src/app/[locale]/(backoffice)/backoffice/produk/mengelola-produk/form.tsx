"use client"

import { ProductCategories, ProductLocationStocks } from "@/app/api/catalogues/type";
import { useGetLocationQuery } from "@/app/api/locations/queries";
import { Locations } from "@/app/api/locations/type";
import { useCreateProductMutation, useUpdateProductMutation } from "@/app/api/product/mutation";
import { ProductUnits } from "@/app/api/product/product-unit/type";
import { useGetProductCategoryQuery, useGetProductUnitQuery } from "@/app/api/product/queries";
import { formProductSchema } from "@/app/api/product/schema";
import { ParamsProductStockMovement, Product } from "@/app/api/product/type";
import { useGetTaxesQuery } from "@/app/api/taxes/queries";
import CustomUpload from "@/components/molecules/UploadImage";
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
import FormProductStockMovementPage from "./form-stock-movement";

interface FormProductPageProps {
    data: Product | null,
    refetch: () => void
    onHiddenForm: () => void
}
 
const FormProductPage: FC<FormProductPageProps> = ({
    data,
    refetch,
    onHiddenForm
}) => {
    const addProduct = useCreateProductMutation();
    const updateProduct = useUpdateProductMutation();

	const {data: productUnitData, isPending: isPendingPU} = useGetProductUnitQuery(100);
	const {data: locationData, isPending: isPendingLocation} = useGetLocationQuery(100);
	const {data: productCategoryData, isPending: isPendingCategory} = useGetProductCategoryQuery(100);
	const {data: taxData, isPending: isPendingTaxes} = useGetTaxesQuery(100);

    const form = useForm<z.infer<typeof formProductSchema>>({
        resolver: zodResolver(formProductSchema)
    });

    // Function to set form values based on data
    const setFormValues = (data: Product) => {
        form.getValues('name') ?? form.setValue('name', data.name);
		form.getValues('description') ?? form.setValue('description', data.description);
		form.getValues('sku') ?? form.setValue('sku', data.sku);
		form.getValues('barcode') ?? form.setValue('barcode', data.barcode);
		form.getValues('sell_price') ?? form.setValue('sell_price', data.sell_price.toString());
		form.getValues('product_category_id') ?? form.setValue('product_category_id', data.product_category_id.toString());
		form.getValues('product_unit_id') ?? form.setValue('product_unit_id', data.product_unit_id.toString());
		form.getValues('product_sell_unit_id') ?? form.setValue('product_sell_unit_id', data.product_sell_unit_id.toString());
		form.getValues('location_id') ?? form.setValue('location_id', data.location_id.toString());
		form.getValues('tax_id') ?? form.setValue('tax_id', data.tax_id?.toString());
		form.getValues('image_url') ?? form.setValue('image_url', data.image_url);
		form.getValues('sell_to_customer') ?? form.setValue('sell_to_customer', data.sell_to_customer ? 'iya' : 'tidak');
		form.getValues('service') ?? form.setValue('service', data.service ? 'iya' : 'tidak');
		form.getValues('modifier') ?? form.setValue('modifier', data.modifier ? 'iya' : 'tidak');
		form.getValues('allow_custom_price') ?? form.setValue('allow_custom_price', data.allow_custom_price ? 'iya' : 'tidak');
		form.getValues('select_all_location') ?? form.setValue('select_all_location', data.select_all_location ? 'iya' : 'tidak');
		form.getValues('location_ids') ?? form.setValue('location_ids', data.location_ids);
		form.getValues('exclude_location_ids') ?? form.setValue('exclude_location_ids', data.exclude_location_ids);
		form.getValues('tax_setting') ?? form.setValue('tax_setting', data.tax_setting);
		form.getValues('last_buying_price') ?? form.setValue('last_buying_price', data.last_buying_price.toString());
    };

    // Check if data is exist
    let isEdit = false;
    if(data?.id) {
        isEdit = true;
        setFormValues(data);
    }

    const onSubmit = (values: z.infer<typeof formProductSchema>) => {
		if (addProduct.isPending || updateProduct.isPending) return;

		const stock_movements = values.stock_movements?.map((stock_movement) => {
			stock_movement.buying_price = Number(values.last_buying_price)

			return stock_movement
		})

		const formattedData = {
		  ...values,
		  stock_movements,
		  location_id: Number(values.location_id),
		  product_unit_id: Number(values.product_unit_id),
		  product_sell_unit_id: Number(values.product_unit_id),
		  sell_price: Number(values.sell_price),
		  last_buying_price: Number(values.last_buying_price),
		  allow_custom_price: values.allow_custom_price === 'iya',
		  modifier: values.modifier === 'iya',
		//   select_all_location: values.select_all_location === 'iya',
		  select_all_location: true,
		  sell_to_customer: values.sell_to_customer === 'iya',
		  service: values.service === 'iya',
		  product_unit_conversions: [],
		  product_sell_prices: [],
		  location_ids: [],
		  exclude_location_ids: [],
		  image_url: null,
		  tax_id: 0, // hardcoded for now
		  tax_setting: null,
		} as unknown as Product;
		
        if(isEdit) formattedData.id = data?.id ?? 0;

        // const valueForm = removeNullOrUndefined(dataForm);
        
        if(!isEdit){
            addProduct.mutate(formattedData, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Create Produk");
                    form.reset();
                    refetch();
                    onHiddenForm();
                },
                onError: () => {
                    showToastError("Gagal Create Produk");
                    // onHiddenForm();
                    // form.reset();
                }
            });
        } else {
            updateProduct.mutate(formattedData, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Produk");
                    refetch();
                    form.reset();
                    onHiddenForm();
                },
                onError: () => {
                    showToastError("Gagal Update Produk");
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

	if (isPendingPU || isPendingLocation || isPendingCategory || isPendingTaxes) {
		return <SkeletonFormPage />;
	  }
	
	// Data preparations for the form options
	const productUnits: ProductUnits[] = productUnitData?.data || [];
	const locations: Locations[] = locationData?.data || [];
	const categories: ProductCategories[] = productCategoryData?.data || [];
	
    return ( 
        <div >
            <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Row 1 */}
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
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan deskripsi"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Row 2 */}
                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SKU</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan sku"
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
                                name="barcode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Barcode</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan barcode"
                                                {...field}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Row 3 */}
                            <FormField
								control={form.control}
								name="product_category_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Kategori</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value || ''}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan kategori" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.map(
													(
														item: ProductCategories
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
                            <FormField
								control={form.control}
								name="product_unit_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Satuan</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan satuan" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{productUnits.map(
													(
														item: ProductUnits
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
                            {/* <FormField
								control={form.control}
								name="product_sell_unit_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Product Sell Unit</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan product sell unit" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{productUnits.map(
													(
														item: ProductUnits,
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
							/> */}
                            {/* Row 5 */}
							<FormField
								control={form.control}
								name="location_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Lokasi</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan lokasi" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{locations.map(
													(
														item: Locations,
														i: number
													) => (
														<SelectItem
															key={item.id}
															value={item.id?.toString() || ''}
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
                            {/* 
							<FormField
								control={form.control}
								name="tax_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tax</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value || ''}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan tax" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{taxes.map(
													(
														item: Taxes,
														i: number
													) => (
														<SelectItem
															key={item.id}
															value={item.id?.toString() || ''}
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
							/> */}
                            {/* <div>
                                <FormLabel className='block mb-4'>
                                    Image Product
                                </FormLabel>
                                <CustomUpload form={form} name="image_url" />
                            </div> */}
                            {/* <div></div> */}
                            {/* Row 6 */}
                            {/* <FormField
								control={form.control}
								name="sell_to_customer"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Sell to customer</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value || "tidak"}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan sell to customer" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{YES_OR_NO.map(
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
								name="service"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Service</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value || "tidak"}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan service" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{YES_OR_NO.map(
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
							/> */}
                            {/* Row 7 */}
                            {/* <FormField
								control={form.control}
								name="modifier"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Modifier</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value || "tidak"}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan modifier" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{YES_OR_NO.map(
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
								name="allow_custom_price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Allow custom price</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value || "tidak"}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan allow custom price" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{YES_OR_NO.map(
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
							/> */}
                            {/* <FormField
								control={form.control}
								name="select_all_location"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Select all location</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value || "tidak"}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Masukkan select all location" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{YES_OR_NO.map(
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
							/> */}
                            {/* Row 8 */}
                            

                            {/* <SelectCheckbox form={form} name="location_ids" label="Contoh"/> */}
                        </div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
                                control={form.control}
                                name="sell_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Harga Jual</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan harga Jual"
                                                {...field}
                                                value={field.value}
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_buying_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Harga Beli</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan harga beli"
                                                {...field}
                                                value={field.value}
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
						</div>
						{/* Row Stock Movement */}
						<FormProductStockMovementPage
							locationsProducts={data?.product_location_stocks}
							buyingPrice={0}
							form={form}
							locations={locations}
						/>
						{/* Row Stock Movement */}
                        <div className='flex gap-4'>
						    <Button className='w-[150px]'>
                                {addProduct.isPending || updateProduct.isPending ? 'Processing...' : !isEdit ? 'Tambah' : 'Update'}
                            </Button>
                            <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Batal</Button>
                        </div>
                    </form>
            </Form>
        </div>
     );
}
 
export default FormProductPage;