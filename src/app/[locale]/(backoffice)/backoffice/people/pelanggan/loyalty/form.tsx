"use client"

import { FC, useState } from "react"
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { IoMdSave } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage";
import { formLoyaltySchema } from "@/app/api/people/pelanggan/loyalty/schema";
import FieldRewardProduct from "./form-product";
import { Loyalties, LoyaltyRewardProduct } from "@/app/api/people/pelanggan/loyalty/type";

interface LoyaltyFormPageProps {
    data?: Loyalties,
    isFetching?: boolean,
    viewMode?: boolean,
    handleSubmit: (data: Loyalties) => void,
    handleCancel: () => void
}

const LoyaltyFormPage: FC<LoyaltyFormPageProps> = (props: LoyaltyFormPageProps) => {
    if (props.isFetching) {
        return <SkeletonFormPage />;
    }

    const t = useTranslations();

    const [deletedRows, setDeletedRows] = useState<LoyaltyRewardProduct[]>([])

    const form = useForm<z.infer<typeof formLoyaltySchema>>({
        resolver: zodResolver(formLoyaltySchema),
        defaultValues: {
            name: props.data?.name,
            description: props.data?.description ?? '',
            miniminal_transaction_value: props.data?.miniminal_transaction_value,
            reward_point: props.data?.reward_point,
            allow_multiple: props.data?.allow_multiple,
            reward_products: props.data?.reward_products,
        }
    });

    const onSubmit = (values: z.infer<typeof formLoyaltySchema>) => {
        const formattedData = {
            ...values,
            reward_products: values.reward_products.concat(deletedRows)
        } as unknown as Loyalties

        props.handleSubmit(formattedData)
    }

    const onCancel = () => {
        props.handleCancel()
    };

    const handleAddProduct = (rows: LoyaltyRewardProduct[]) => {
        form.setValue('reward_products', rows)
    }

    const handleDeleteProduct = (row: LoyaltyRewardProduct[]) => {
        setDeletedRows(row)
    }

    const allow_multiple = form.watch('allow_multiple')

    return (
        <div>
            <PageTitleSetting title={t("add_new_your", { name: t('loyalty') })} />
            <div className="container mx-auto py-10">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('loyalty')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('enter_your', { name: t('loyalty') })}
                                                readOnly={props.viewMode}
                                                {...field}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="miniminal_transaction_value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('miniminal_transaction_value')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('enter_your', { name: t('miniminal_transaction_value') })}
                                                readOnly={props.viewMode}
                                                type="number"
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
                                name="reward_point"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('reward_point')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('enter_your', { name: t('reward_point') })}
                                                readOnly={props.viewMode}
                                                type="number"
                                                {...field}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('description')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('enter_your', { name: t('description') })}
                                                {...field}
                                                value={field.value}
                                                readOnly={props.viewMode}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="allow_multiple"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mr-4">{t('allow_multiple')}</FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={() => form.setValue('allow_multiple', !allow_multiple)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="reward_products"
                                render={({ field }) => (
                                    <FieldRewardProduct
                                        onAddProduct={handleAddProduct}
                                        onDeleteProduct={handleDeleteProduct}
                                        viewMode={props.viewMode}
                                        reward_products={props.data?.reward_products}
                                    />
                                )}
                            />
                        </div>
                        <div className='flex gap-4'>
                            <Button onClick={onCancel} variant="outline" type='button'>
                                <IoArrowBack className="mr-2" /> {t('back')}
                            </Button>
                            {
                                props.viewMode ? <></> : <Button variant="default">
                                    <IoMdSave className="mr-2" /> {t('add_new_your', { name: t('loyalty')})}
                                </Button>
                            }
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default LoyaltyFormPage;