"use client";

import { FC, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PercentCircle } from "lucide-react";
import {
    Command,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { capitalizeWords } from "@/lib/helpers";
import { useTranslations } from "next-intl";

interface DiskonAllDropdownProps {
    disabled?: boolean,
    full?: boolean,
    name?: string,
    defaultValue?: string,
    handleValueChange?: (id: string) => void,  // if multiSelect = false
}

const DiskonAllDropdown: FC<DiskonAllDropdownProps> = (props: DiskonAllDropdownProps) => {
    const t = useTranslations();

    const [value, setValue] = useState<string | null>(props.defaultValue ?? null);

    useEffect(() => { props.handleValueChange && value && props.handleValueChange(value) }, [value]);
   
    const labelButton = () => {
        if (value == 'true') {
            return capitalizeWords('Diskon');
        } else if (value == 'false') {
            return capitalizeWords('Tanpa Diskon');
        } else if (value == 'all') {
            return capitalizeWords('Semua');
        }

        return t('select_your', { name: 'Value' })
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
                        <PercentCircle className="mr-2 h-4 w-4" />
                        <span>{ labelButton() }</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command shouldFilter={false}>
                        <CommandList>
                            <CommandItem
                                key='all'
                                value='all'
                                onSelect={() => (setValue('all'))}
                            >
                                Semua
                            </CommandItem>
                            <CommandItem
                                key='true'
                                value='true'
                                onSelect={() => (setValue('true'))}
                            >
                                Diskon
                            </CommandItem>
                            <CommandItem
                                key='false'
                                value='false'
                                onSelect={() => (setValue('false'))}
                            >
                                Tanpa Diskon
                            </CommandItem>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
    )
}

export default DiskonAllDropdown;
