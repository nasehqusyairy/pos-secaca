"use client";

import { FC, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Square, SquareCheck, User2Icon } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { useGetDropdownCustomerCategoryQuery } from "@/app/api/dropdown/query";
import { capitalizeWords } from "@/lib/helpers";
import { useTranslations } from "next-intl";
import { Locations } from "@/app/api/locations/type";
import { CustomerCategories } from "@/app/api/people/pelanggan/kategori-pelanggan/type";

interface CustomerCategoryDropdownProps {
    multiSelect?: boolean,
    disabled?: boolean,
    showSelectAll?: boolean,
    full?: boolean,
    name?: string,
    defaultSelectAll?: boolean,
    defaultValue?: CustomerCategories,
    defaultValues?: CustomerCategories,
    defaultId?: number,
    defaultIds?: number[],
    defaultExcludeIds?: number[],
    handleIdChange?: (id: number) => void,  // if multiSelect = false
    handleIdsChange?: (ids: number[]) => void,
    handleExcludeIdsChange?: (ids: number[]) => void,
    handleSelectAllChange?: (selectAll: boolean) => void,
}

const CustomerCategoryDropdown: FC<CustomerCategoryDropdownProps> = (props: CustomerCategoryDropdownProps) => {
    const t = useTranslations();

    const showSelectAll = props.showSelectAll ?? false;

    const [selectAll, setSelectAll] = useState(props.defaultSelectAll ?? false);
    const [keyword, setKeyword ] = useState('');
    const [id, setId] = useState(props.defaultId ?? 0);
    const [location, setLocation] = useState<CustomerCategories | null>(props.defaultValue ?? null);
    const [ids, setIds] = useState(props.defaultIds ?? []);
    const [excludeIds, setExcludeIds] = useState(props.defaultExcludeIds ?? []);

    const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useGetDropdownCustomerCategoryQuery(10, keyword);

    const handleLoadMore = () => {
        fetchNextPage()
    }

    useEffect(() => { props.handleIdChange && props.handleIdChange(id) }, [id]);
    useEffect(() => { props.handleIdsChange && props.handleIdsChange(ids) }, [ids]);
    useEffect(() => { props.handleExcludeIdsChange && props.handleExcludeIdsChange(excludeIds) }, [excludeIds]);
    useEffect(() => { props.handleSelectAllChange && props.handleSelectAllChange(selectAll) }, [selectAll]);

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

    const handleSelect = (location: Locations) => {
        setLocation(location)

        handleSingleSelect(location.id)
        handleMultiSelect(location.id)
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
        if (!props.multiSelect && location) {
            return capitalizeWords(location.name);
        } else if (selectAll && excludeIds.length > 0) {
            return t('select_exclude_count_your', { count: excludeIds.length, name: t('customer_category')})
        } else if (!selectAll && ids.length > 0) {
            return t('select_count_your', { count: ids.length, name: t('customer_category')})
        } else if (selectAll) {
            return t('all_your', { name: t('customer_category')})
        }

        return t('select_your', { name: t('customer_category')})
    }
    
    const itemList = (group: any) => {
        if (!group.data) return (<></>)

        return group.data.data.map((loc: Locations) => (
            <CommandItem
                key={loc.id}
                value={loc.id?.toString()}
                onSelect={() => ( handleSelect(loc) )}
            >
                { itmeCheckMark(loc.id) }
                { capitalizeWords(loc.name) }
            </CommandItem>
        ))
    }

    return (
        <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        disabled={ props.disabled }
                        className={cn(
                            "w-[160px] justify-start text-left font-normal bg-white",
                            (props.full ? 'w-full' : '')
                        )}
                    >
                        <User2Icon className="mr-2 h-4 w-4" />
                        <span>{ labelButton() }</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full" onScroll={handleScroll} onScrollCapture={handleScrollCapture}>
                    <Command shouldFilter={ false }>
                        <CommandInput
                            placeholder={ t('search_name', {name: t('customer_category')})}
                            onValueChange={ setKeyword }
                            inputMode="text"
                        />
                        <CommandList>
                            <CommandEmpty>
                                {(isFetching || isFetchingNextPage) ? t('loading') : t('not_found_name', {name: t('customer_category')})}
                            </CommandEmpty>
                            {!showSelectAll || !props.multiSelect || (isFetching || isFetchingNextPage) ? <></> : <CommandItem onSelect={handleSelectAll}>
                                {checkMark(selectAll)} { t('all_your', { name: t('customer_category')}) }
                            </CommandItem>}
                            {(isFetching || isFetchingNextPage || !data) ? <></> : data.pages.map((group) => (
                                itemList(group)
                            ))}
                            {
                                (isFetching || isFetchingNextPage || !hasNextPage) ? <></> : <CommandItem onSelect={ handleLoadMore }>
                                    { t('load_more') }
                                </CommandItem>
                            }
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
    )
}

export default CustomerCategoryDropdown;