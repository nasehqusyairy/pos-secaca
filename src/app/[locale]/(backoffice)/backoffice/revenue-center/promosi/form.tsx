"use client"

import { FC } from "react"
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { IoMdSave } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { formPromoSchema, promoRewardAppliedToEnum, promoRewardTemplateEnum } from "@/app/api/revenue-center/promo/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaDollarSign, FaPercentage } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import CustomerCategoryDropdown from "@/components/templates/Dropdowns/customer-category-dropdown";
import LocationDropdown from "@/components/templates/Dropdowns/location-dropdown";
import SkeletonFormPage from "@/components/organisms/Skeleton/SkeletonFormPage";
import { Promo } from "@/app/api/revenue-center/promo/type";
import { Locations } from "@/app/api/locations/type";

interface PromoFormPageProps {
    data?: Promo,
    isFetching?: boolean,
    viewMode?: boolean,
    handleSubmit: (data: Promo) => void,
    handleCancel: () => void
}

const PromoFormPage: FC<PromoFormPageProps> = (props: PromoFormPageProps) => {
    if (props.isFetching) {
        return <SkeletonFormPage />;
    }

    const t = useTranslations();

    const promo_reward_template_setter = (template?: string) => {
        if (!template) return

        return promoRewardTemplateEnum.parse(template)
    }

    const promo_reward_applied_to_setter = (applied_to?: string) => {
        if (!applied_to) return

        return promoRewardAppliedToEnum.parse(applied_to)
    }

    const form = useForm<z.infer<typeof formPromoSchema>>({
        resolver: zodResolver(formPromoSchema),
        defaultValues: {
            name: props.data?.name,
            start_at: props.data?.start_at.toString().slice(0, 10),
            end_at: props.data?.end_at?.toString().slice(0, 10),
            description: props.data?.description,
            owner_location_id: props.data?.owner_location_id.toString(),
            promo_reward: {
                template: promo_reward_template_setter(props.data?.promo_reward.template),
                applied_to: promo_reward_applied_to_setter(props.data?.promo_reward.applied_to),
                in_house_percentage: props.data?.promo_reward.in_house_percentage.toString(),
                percentage: props.data?.promo_reward.percentage,
                reward_amount: props.data?.promo_reward.reward_amount.toString(),
                reward_maximum_amount: props.data?.promo_reward.reward_maximum_amount?.toString(),
            },
            promo_rule: {
                show_customer_category_ids: props.data?.promo_rule.promo_rule_customer_categories != undefined,
                customer_category_ids: props.data?.promo_rule.promo_rule_customer_categories?.map((obj: any) => obj.customer_category_id.toString()),
                show_minimum_sales_purchase: props.data?.promo_rule.minimum_sales_purchase != undefined,
                minimum_sales_purchase: props.data?.promo_rule.minimum_sales_purchase?.toString(),
                order_type_ids: props.data?.promo_rule.order_type_ids?.map((id: any) => id.toString()),
            }
        }
    });

    const onSubmit = (values: z.infer<typeof formPromoSchema>) => {
        const promo_rule = {
            ...values.promo_rule,
            minimum_sales_purchase: values.promo_rule.show_minimum_sales_purchase ? values.promo_rule.minimum_sales_purchase : undefined,
            customer_category_ids: values.promo_rule.show_customer_category_ids ? values.promo_rule.customer_category_ids : undefined,
        }

        const formattedData = {
            ...values,
            promo_rule,
        } as unknown as Promo

        props.handleSubmit(formattedData)
    }

    const onCancel = () => {
        props.handleCancel()
    };

    const transformTolLocation = (): (Locations | undefined) => {
        if (!props.data?.owner_location) return

        return {
            id: props.data.owner_location.id,
            name: props.data.owner_location.name
        } as Locations
    }

    const toDateFromString = (value?: string) => {
        if (!value) return

        return new Date(value)
    }

    const promo_reward_template = form.watch('promo_reward.template')
    const promo_rule_show_minimum_sales_purchase = form.watch('promo_rule.show_minimum_sales_purchase')
    const promo_rule_show_customer_category_ids = form.watch('promo_rule.show_customer_category_ids')

    return (
        <div>
            <PageTitleSetting title={t("promosi_new")} />
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
                                        <FormLabel>{t('promo_name')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('enter_your', { name: t('promo_name') })}
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
                                name="start_at"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('start_at')}</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal bg-white",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        disabled={props.viewMode}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? field.value : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={new Date(field.value)}
                                                        onSelect={(day) => day && form.setValue('start_at', day.toISOString().slice(0, 10))}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="end_at"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('end_at')}</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal bg-white",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        disabled={props.viewMode}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? <span>{field.value}</span> : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={ toDateFromString(field.value) }
                                                        onSelect={(day) => day && form.setValue('end_at', day.toISOString().slice(0, 10))}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
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
                                name="promo_reward.template"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('promotion_type')}</FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-3 gap-4">
                                                <Button
                                                    type="button"
                                                    variant={field.value == 'discount_percentage' ? 'default' : "outline"}
                                                    className="w-full justify-start text-left font-normal"
                                                    onClick={() => form.setValue('promo_reward.template', 'discount_percentage')}
                                                    disabled={props.viewMode}
                                                >
                                                    <FaPercentage className="mr-2 h-4 w-4" />
                                                    {t('percentage')}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={field.value == 'discount_fixed' ? 'default' : "outline"}
                                                    className="w-full justify-start text-left font-normal"
                                                    onClick={() => form.setValue('promo_reward.template', 'discount_fixed')}
                                                    disabled={props.viewMode}
                                                >
                                                    <FaDollarSign className="mr-2 h-4 w-4" />
                                                    {t('fixed_amount')}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div
                            className={cn(
                                "grid gap-4",
                                (promo_reward_template == 'discount_percentage' ? 'grid-cols-2' : 'grid-cols-1')
                            )}
                        >
                            <FormField
                                control={form.control}
                                name="promo_reward.reward_amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('reward_amount')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder={t('enter_your', { name: t('reward_amount') })}
                                                {...field}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {promo_reward_template == null || promo_reward_template == 'discount_fixed' ? <></> : <FormField
                                control={form.control}
                                name="promo_reward.reward_maximum_amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('reward_maximum_amount')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder={t('enter_your', { name: t('reward_maximum_amount') })}
                                                {...field}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />}
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="promo_rule.show_minimum_sales_purchase"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mr-4">{t('minimum_sales_purchase')}</FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={() => form.setValue('promo_rule.show_minimum_sales_purchase', !promo_rule_show_minimum_sales_purchase)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {promo_rule_show_minimum_sales_purchase ? <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="promo_rule.minimum_sales_purchase"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel>{t('minimum_sales_purchase')}</FormLabel> */}
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder={t('enter_your', { name: t('minimum_sales_purchase') })}
                                                {...field}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div> : <></>}
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="promo_rule.show_customer_category_ids"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mr-4">{t('customer_category')}</FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={() => form.setValue('promo_rule.show_customer_category_ids', !promo_rule_show_customer_category_ids)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {promo_rule_show_customer_category_ids ? <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="promo_rule.customer_category_ids"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <CustomerCategoryDropdown
                                                key="customer-category-dropdown"
                                                full
                                                multiSelect
                                                disabled={props.viewMode}
                                                defaultIds={field.value?.map((id) => Number(id))}
                                                handleIdsChange={(ids) => form.setValue('promo_rule.customer_category_ids', ids.map((id) => id.toString()))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div> : <></>}
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="owner_location_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mr-4">{t('owner_location')}</FormLabel>
                                        <FormControl>
                                            <LocationDropdown
                                                key="location-dropdown"
                                                full
                                                disabled={props.viewMode}
                                                defaultValue={transformTolLocation()}
                                                defaultId={Number(field.value)}
                                                handleIdChange={(id) => form.setValue('owner_location_id', id.toString())}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex gap-4'>
                            <Button onClick={onCancel} variant="outline" type='button'>
                                <IoArrowBack className="mr-2" /> {t('back')}
                            </Button>
                            {
                                props.viewMode ? <></> : <Button variant="default">
                                    <IoMdSave className="mr-2" /> {t('promosi_new')}
                                </Button>
                            }
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default PromoFormPage;