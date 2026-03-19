import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Popover } from "@radix-ui/react-popover";
import { CheckIcon, PlusIcon } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";

interface SelectCheckboxProps {
	form: any;
	name: string;
	label: string;
}

const contohData = [
    {
        id: "1",
        name: "test",
    },
    {
        id: "2",
        name: "test2",
    },
];  

const SelectCheckbox: FC<SelectCheckboxProps> = ({ form, name, label }) => {
	const [isHide, setHide] = useState<boolean>(false);
	const [values, setValues] = useState<string[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSaveValue = (item: string) => {
		// const value = inputRef.current?.value;

		// if (value === "") {
		// 	return;
		// }

		const newValue: any = [...values, item];

		setValues(newValue);

		form.setValue(name, newValue);
	};

	const handleDeleteValue = (item: string) => {
		const skills: any = values.filter((value: string) => item !== value);

		setValues(skills);
		form.setValue(name, skills);
	};

    const handleDeleteAllValue = () => {
        setValues([]);
        form.setValue(name, []);
    }

	useEffect(() => {
		const val = form.getValues(name);

		if (val && val.length > 0) {
			setValues(val);
		}
	}, [form, name]);

    const title="Select "+label;
    const selectedValues = new Set(values);

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="block mb-4">{label}</FormLabel>
					<FormControl>
						<>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-full flex justify-start p-5">
                                <PlusIcon className="w-4 h-4 mr-2" />
                                {title}
                                {selectedValues?.size > 0 && (
                                    <>
                                    <Separator orientation="vertical" className="mx-2 h-4" />
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal lg:hidden"
                                    >
                                        {selectedValues.size}
                                    </Badge>
                                    <div className="hidden space-x-1 lg:flex">
                                        {selectedValues.size > 2 ? (
                                        <Badge
                                            variant="secondary"
                                            className="rounded-sm px-1 font-normal"
                                        >
                                            {selectedValues.size} selected
                                        </Badge>
                                        ) : (
                                            values
                                            .map((values) => (
                                            <Badge
                                                variant="secondary"
                                                key={values}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {values}
                                            </Badge>
                                            ))
                                        )}
                                    </div>
                                    </>
                                )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command>
                                <CommandInput placeholder={title}/>
                                <CommandList>
                                    <CommandEmpty>Data tidak ditemukan.</CommandEmpty>
                                    <CommandGroup>
                                        {contohData.map((option) => {
                                            const isSelected = selectedValues.has(option.id)

                                            return (
                                                <CommandItem
                                                    key={option.name}
                                                    onSelect={() => {
                                                        if (isSelected) {
                                                            handleDeleteValue(option.id)
                                                        } else {
                                                            handleSaveValue(option.id)
                                                        }
                                                    }}
                                                    >
                                                    <div
                                                        className={cn(
                                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        isSelected
                                                            ? "bg-primary text-primary-foreground"
                                                            : "opacity-50 [&_svg]:invisible"
                                                        )}
                                                    >
                                                        <CheckIcon className={cn("h-4 w-4")} />
                                                    </div>
                                                    <span>{option.name}</span>
                                                </CommandItem>
                                            )
                                        })}
                                    </CommandGroup>
                                    {selectedValues.size > 0 && (
                                        <>
                                            <CommandSeparator />
                                            <CommandGroup>
                                            <CommandItem
                                                onSelect={handleDeleteAllValue}
                                                className="justify-center text-center"
                                            >
                                                Hapus semua
                                            </CommandItem>
                                            </CommandGroup>
                                        </>
                                    )}
                                </CommandList>
                            </Command>
                            </PopoverContent>
                        </Popover>
						</>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default SelectCheckbox;
