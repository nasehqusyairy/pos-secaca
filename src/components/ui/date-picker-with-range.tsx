"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";


export interface DatePickerWithRangeProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    today?: Date,
    date?: DateRange,
    setDate: (range: DateRange | undefined) => void,
    numberOfMonth?: number
}

export const DatePickerWithRange = React.forwardRef<HTMLButtonElement, DatePickerWithRangeProps>(
    ({ className, date, setDate, today, numberOfMonth = 2 }) => {
        const handlePresetChange = (value: string) => {
            const today = new Date();

            switch (value) {
                case 'today':
                    setDate({
                        from: today,
                        to: today,
                    })
                    break
                case 'week':
                    setDate({
                        from: addDays(today, -7),
                        to: today,
                    })
                    break
                case 'month':
                    setDate({
                        from: addDays(today, -30),
                        to: today,
                    })
                    break
            }
        }

        return (
            <div className={cn("grid gap-2", className)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left font-normal", !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "dd/LL/y")} -{" "}
                                        {format(date.to, "dd/LL/y")}
                                    </>
                                ) : (
                                    format(date.from, "dd/LLL/y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-auto flex-col space-y-2 p-2" align="start">
                        <Select onValueChange={(value) => handlePresetChange(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                            </SelectContent>
                        </Select>
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => (today != undefined && date > today)}
                            numberOfMonths={numberOfMonth}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)

// export function DatePickerWithRangex({
//     className,
// }: React.HTMLAttributes<HTMLDivElement>) {
//     const [date, setDate] = React.useState<DateRange | undefined>({
//         from: new Date(2022, 0, 20),
//         to: addDays(new Date(2022, 0, 20), 20),
//     })

//     return (
//         <div className={cn("grid gap-2", className)}>
//             <Popover>
//                 <PopoverTrigger asChild>
//                     <Button
//                         id="date"
//                         variant={"outline"}
//                         className={cn(
//                             "w-[300px] justify-start text-left font-normal",
//                             !date && "text-muted-foreground"
//                         )}
//                     >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {date?.from ? (
//                             date.to ? (
//                                 <>
//                                     {format(date.from, "LLL dd, y")} -{" "}
//                                     {format(date.to, "LLL dd, y")}
//                                 </>
//                             ) : (
//                                 format(date.from, "LLL dd, y")
//                             )
//                         ) : (
//                             <span>Pick a date</span>
//                         )}
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                         initialFocus
//                         mode="range"
//                         defaultMonth={date?.from}
//                         selected={date}
//                         onSelect={setDate}
//                         numberOfMonths={2}
//                     />
//                 </PopoverContent>
//             </Popover>
//         </div>
//     )
// }
