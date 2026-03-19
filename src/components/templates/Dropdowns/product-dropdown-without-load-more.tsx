"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MapPinIcon, Square, SquareCheck } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { useGetDropdownProductWithoutLoadMoreQuery } from "@/app/api/dropdown/query";
import { capitalizeWords } from "@/lib/helpers";
import { useTranslations } from "next-intl";
import { ProductDropdown } from "@/types/dropdown";
import { Product } from "@/app/api/product/type";

interface ProductDropdownProps {
    disabled?: boolean,
    full?: boolean,
    name?: string,
    defaultId?: number,
    defaultValue?: ProductDropdown | null,
    defaultExcludeIds?: number[],
    handleIdChange?: (id: number) => void,
    handleValueChange?: (value: ProductDropdown) => void,
}

const ProductDropdownSelectWithoutLoadMore: FC<ProductDropdownProps> = (props: ProductDropdownProps) => {
    const t = useTranslations();

    const inputSearchValueRef = useRef<HTMLInputElement>(null);
    const [keyword, setKeyword] = useState('');
    const [value, setValue] = useState<ProductDropdown | null>(props.defaultValue ?? null);
    const [id, setId] = useState(value?.id ?? props.defaultId ?? 0);
    const { data, isPending, refetch } = useGetDropdownProductWithoutLoadMoreQuery(
        10, keyword, props.defaultExcludeIds || []
    );

    useEffect(() => { props.handleIdChange && props.handleIdChange(id) }, [id]);
    useEffect(() => { props.handleValueChange && value && props.handleValueChange(value) }, [value]);
    useEffect(() => { refetch() }, [keyword]);

    const handleSelect = (value: ProductDropdown) => {
        setValue(value)
        setId(value.id)
    }

    const itemChecked = (selectedId: number): boolean => {
        return id == selectedId || props.defaultValue?.id == selectedId;
    }

    const itmeCheckMark = (id: number) => {
        return checkMark(itemChecked(id))
    }

    const checkMark = (checked: boolean) => {
        return (
            checked ? <SquareCheck className="mr-2 h-4 w-4 opacity-100" /> : <Square className="mr-2 h-4 w-4 opacity-100" />
        )
    }

    const labelButton = () => {
        if (value || props.defaultValue) {
            return capitalizeWords(value?.name || props.defaultValue?.name || '');
        }

        return t('select_your', { name: t('product') })
    }

    const handleKeyDownSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key == 'Enter' && inputSearchValueRef && inputSearchValueRef.current) {
        setKeyword(inputSearchValueRef.current.value)
      }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    disabled={props.disabled}
                    className={cn(
                        "w-[160px] justify-start text-left font-normal bg-white", (props.full ? 'w-full' : '')
                    )}
                >
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    <span>{labelButton()}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={t('search_name', { name: t('product') })}
                        ref={inputSearchValueRef}
                        onKeyDown={handleKeyDownSearch}
                        inputMode="text"
                    />
                    <CommandList>
                        <CommandEmpty>
                            {(isPending) ? t('loading') : t('not_found_name', { name: t('product') })}
                        </CommandEmpty>
                        { !isPending && <CommandGroup>
                                {data?.data.data.map((product: ProductDropdown) => (
                                    <CommandItem
                                        key={product.id}
                                        value={product.id?.toString()}
                                        onSelect={() => (handleSelect(product))}
                                    >
                                        {itmeCheckMark(product.id)}
                                        {capitalizeWords(product.name)}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        }
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default ProductDropdownSelectWithoutLoadMore;
