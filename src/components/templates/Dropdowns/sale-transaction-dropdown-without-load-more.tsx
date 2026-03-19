"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchIcon, Square, SquareCheck } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { capitalizeWords } from "@/lib/helpers";
import { useTranslations } from "next-intl";
import { GetInvoicesQueryParams, InvoiceModel } from "@/types/invoice";
import { useGetInvoicesQueryWithCursorV2 } from "@/app/api/invoice/query";

interface SaleTransactionDropdownProps {
    disabled?: boolean,
    full?: boolean,
    name?: string,
    defaultId?: number,
    defaultValue?: InvoiceModel | null,
    defaultExcludeIds?: number[],
    excludeSaleIds: number[],
    locationIds: number[],
    refundProductAmount: number,
    handleIdChange?: (id: number) => void,
    handleValueChange?: (value: InvoiceModel) => void,
}

const SaleTransactionDropdownSelectWithoutLoadMore: FC<SaleTransactionDropdownProps> = (props: SaleTransactionDropdownProps) => {
    const t = useTranslations();

    // ref
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const inputSearchValueRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [value, setValue] = useState<InvoiceModel | null>(props.defaultValue ?? null);
    const [id, setId] = useState(value?.id ?? props.defaultId ?? 0);

    const param: GetInvoicesQueryParams = {
        limit: 5,
        locs: props.locationIds,
        refund_amount: props.refundProductAmount,
        keyword: keyword,
        exclude_ids: props.excludeSaleIds,
    }
    const { data, isPending, isError, refetch } = useGetInvoicesQueryWithCursorV2(param);

    useEffect(() => { props.handleIdChange && props.handleIdChange(id) }, [id]);
    useEffect(() => { props.handleValueChange && value && props.handleValueChange(value) }, [value]);
    useEffect(() => { refetch() }, [keyword, props.locationIds]);

    const handleSelect = (value: InvoiceModel) => {
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
            return (value?.sales_no || props.defaultValue?.sales_no || '');
        }

        return t('select_your', { name: 'struk' })
    }

    const handleKeyDownSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key == 'Enter' && inputSearchValueRef && inputSearchValueRef.current) {
        setKeyword(inputSearchValueRef.current.value)
      }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={buttonRef}
                    variant={"outline"}
                    disabled={props.disabled}
                    className={cn(
                        "w-[160px] justify-start text-left font-normal bg-white", (props.full ? 'w-full' : '')
                    )}
                >
                    <SearchIcon className="mr-2 h-4 w-4" />
                    <span>{labelButton()}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width: buttonRef.current?.offsetWidth }}>
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={t('search_name', { name: 'struk' })}
                        ref={inputSearchValueRef}
                        onKeyDown={handleKeyDownSearch}
                        inputMode="text"
                    />
                    <CommandList>
                        <CommandEmpty>
                            {(isPending) ? t('loading') : t('not_found_name', { name: 'struk' })}
                        </CommandEmpty>
                        { !isPending && !isError && <CommandGroup>
                                {data?.data?.data?.map((product: InvoiceModel) => (
                                    <CommandItem
                                        key={product.id}
                                        value={product.id?.toString()}
                                        onSelect={() => (handleSelect(product))}
                                        onClick={() => setOpen(false)}
                                    >
                                        {itmeCheckMark(product.id)}
                                        {capitalizeWords(product.sales_no)}
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

export default SaleTransactionDropdownSelectWithoutLoadMore;
