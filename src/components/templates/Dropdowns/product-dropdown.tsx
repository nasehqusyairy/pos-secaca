"use client";

import { FC, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, MapPinIcon, Square, SquareCheck } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { useGetDropdownProductQuery } from "@/app/api/dropdown/query";
import { capitalizeWords } from "@/lib/helpers";
import { useTranslations } from "next-intl";
import { ProductDropdown } from "@/types/dropdown";

interface ProductDropdownProps {
    multiSelect?: boolean,
    disabled?: boolean,
    full?: boolean,
    name?: string,
    defaultSelectAll?: boolean,
    defaultId?: number,
    defaultIds?: number[],
    defaultExcludeIds?: number[],
    defaultSelectedIds?: number[],
    defaultValue?: ProductDropdown | null,
    handleIdChange?: (id: number) => void,  // if multiSelect = false
    handleIdsChange?: (ids: number[]) => void,
    handleExcludeIdsChange?: (ids: number[]) => void,
    handleSelectAllChange?: (selectAll: boolean) => void,
    handleValueChange?: (value: ProductDropdown) => void,
}

const ProductDropdownSelect: FC<ProductDropdownProps> = (props: ProductDropdownProps) => {
    const t = useTranslations();

    const [selectAll, setSelectAll] = useState(props.defaultSelectAll ?? false);
    const [keyword, setKeyword] = useState('');
    const [value, setValue] = useState<ProductDropdown | null>(props.defaultValue ?? null);

    const [id, setId] = useState(value?.id ?? props.defaultId ?? 0);
    const [ids, setIds] = useState(props.defaultIds ?? []);
    const [excludeIds, setExcludeIds] = useState(props.defaultExcludeIds ?? []);

    const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useGetDropdownProductQuery(10, keyword, props.defaultSelectedIds ?? []);

    const handleLoadMore = () => {
        fetchNextPage()
    }

    useEffect(() => { props.handleIdChange && props.handleIdChange(id) }, [id]);
    useEffect(() => { props.handleIdsChange && ids && props.handleIdsChange(ids) }, [ids]);
    useEffect(() => { props.handleExcludeIdsChange && excludeIds && props.handleExcludeIdsChange(excludeIds) }, [excludeIds]);
    useEffect(() => { props.handleSelectAllChange && props.handleSelectAllChange(selectAll) }, [selectAll]);
    useEffect(() => { props.handleValueChange && value && props.handleValueChange(value) }, [value]);

    // TODO: Add Debounce
    useEffect(() => { refetch() }, [keyword]);

    const itemChecked = (selectedId: number): boolean => {
        // if (!ids) return false;

        if (selectAll && !excludeIds.includes(selectedId)) {
            return true
        } else if (!selectAll && ids.includes(selectedId)) {
            return true
        }

        return id == selectedId;
    }

    const handleSelect = (value: ProductDropdown) => {
        setValue(value)

        handleSingleSelect(value.id)
        handleMultiSelect(value.id)
    }

    const handleSingleSelect = (id: number) => {
        if (props.multiSelect) return

        setId(id)
    }

    const handleMultiSelect = (id: number) => {
        if (!props.multiSelect) return

        handleMultiSelectIds(id, ids.indexOf(id));
        handleMultiSelectExcludeIds(id, excludeIds.indexOf(id));
    }

    const handleMultiSelectIds = (id: number, index: number) => {
        if (selectAll) return

        if (index > -1) { // not found
            setIds(prev => prev.filter(x => x != id))
        } else {
            setIds(prev => [...prev, id])
        }
    }

    const handleMultiSelectExcludeIds = (id: number, index: number) => {
        if (!selectAll) return

        if (index > -1) { // not found
            setExcludeIds(prev => prev.filter(x => x != id))
        } else {
            setExcludeIds(prev => [...prev, id])
        }
    }

    const handleScroll = () => {
        console.log("event handleScroll")
    }

    const handleScrollCapture = () => {
        console.log("event handleScrollCapture")
    }

    const handleSelectAll = () => {
        setSelectAll(prev => !prev)
        setIds([])
        setExcludeIds([])
    }

    const itmeCheckMark = (id: number) => {
        if (!props.multiSelect) return (singleCheckMark(itemChecked(id)))

        return checkMark(itemChecked(id))
    }

    const singleCheckMark = (checked: boolean) => {
        return (
            checked ? <Check className="mr-2 h-4 w-4 opacity-100" /> : <Check className="mr-2 h-4 w-4 opacity-0" />
        )
    }

    const checkMark = (checked: boolean) => {
        return (
            checked ? <SquareCheck className="mr-2 h-4 w-4 opacity-100" /> : <Square className="mr-2 h-4 w-4 opacity-100" />
        )
    }

    const labelButton = () => {
        if (!props.multiSelect && value) {
            return capitalizeWords(value.name);
        } else if (selectAll && excludeIds.length > 0) {
            return t('select_exclude_count_your', { count: excludeIds.length, name: t('product') })
        } else if (!selectAll && ids.length > 0) {
            return t('select_count_your', { count: ids.length, name: t('product') })
        } else if (selectAll) {
            return t('all_your', { name: t('product') })
        }

        return t('select_your', { name: t('product') })
    }

    const itemList = (group: any) => {
        if (!group.data) return (<></>)

        return group.data.data.map((value: ProductDropdown) => (
            <CommandItem
                key={value.id}
                value={value.id?.toString()}
                onSelect={() => (handleSelect(value))}
            >
                {itmeCheckMark(value.id)}
                {capitalizeWords(value.name)}
            </CommandItem>
        ))
    }

    return (
        <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        disabled = { props.disabled }
                        className={cn(
                            "w-[160px] justify-start text-left font-normal bg-white",
                            (props.full ? 'w-full' : '')
                        )}
                    >
                        <MapPinIcon className="mr-2 h-4 w-4" />
                        <span>{labelButton()}</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" onScroll={handleScroll} onScrollCapture={handleScrollCapture}>
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={t('search_name', { name: t('product') })}
                            onValueChange={setKeyword}
                            inputMode="text"
                        />
                        <CommandList>
                            <CommandEmpty>
                                {(isFetching || isFetchingNextPage) ? t('loading') : t('not_found_name', {name: t('product')})}
                            </CommandEmpty>
                            {!props.multiSelect || (isFetching || isFetchingNextPage) ? <></> : <CommandItem onSelect={handleSelectAll}>
                                {checkMark(selectAll)} { t('all_your', { name: t('product')}) }
                            </CommandItem>}
                            {(isFetching || isFetchingNextPage || !data) ? <></> : data.pages.map((group) => (
                                itemList(group)
                            ))}
                            {
                                (isFetching || isFetchingNextPage || !hasNextPage) ? <></> : <CommandItem onSelect={handleLoadMore}>Load more</CommandItem>
                            }
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
    )
}

export default ProductDropdownSelect;
