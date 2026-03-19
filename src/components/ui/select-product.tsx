"use client"

import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { Select } from "@radix-ui/react-select"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { capitalizeWords } from "@/lib/helpers"
import { useGetLocationQuery } from "@/app/api/locations/queries"
import { Locations } from "@/app/api/locations/type"

interface SelectProductProps {
    label: string,
    name: string,
    excludeIds?: number[],
    control?: Control,
    defaultValue: string,
    onValueChange: (value: string) => void
}

const SelectProduct = (props: SelectProductProps) => {
    const { data } = useGetLocationQuery(100);

    const locations = data?.data;

    return (
            <FormField
                control={props.control}
                name={props.name}
                render={() => (
                    <FormItem>
                        <FormLabel>{props.label}</FormLabel>
                        <Select
                            onValueChange={props.onValueChange}
                            defaultValue={props.defaultValue}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a from location" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {locations.map(
                                    (
                                        item: Locations
                                    ) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id?.toString() ?? ''}
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
    )
}

export default SelectProduct;