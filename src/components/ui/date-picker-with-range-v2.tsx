"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react";
import { addDays, format, endOfDay } from "date-fns"
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
    key: string,
    today?: Date,
    startDate?: Date,
    endDate?: Date,
    setDate: (range: DateRange | undefined) => void,
    numberOfMonth?: number
}

export const DatePickerWithRangeV2 = React.forwardRef<HTMLButtonElement, DatePickerWithRangeProps>(
    ({ key, className, startDate, endDate, setDate, today, numberOfMonth = 2 }) => {

        const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
            from: startDate,
            to: endDate,
        })

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
        
        React.useEffect(() => {
            if (!dateRange) return;
    
            if (dateRange.from) {
                dateRange.from.setHours(0, 0, 0, 0);
            } else {
                dateRange.from = startDate
            }
    
            if (dateRange.to) {
                dateRange.to = (endOfDay(dateRange.to))
            } else {
                dateRange.to = (endOfDay(dateRange.from ?? startDate ?? today ?? new Date()))
            }

            setDate(dateRange)
        }, [dateRange]);

        return (
            <div className={cn("grid gap-2", className)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id={'date-date-range-v2-' + key}
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left font-normal", !dateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "dd/LL/y")} -{" "}
                                        {format(dateRange.to, "dd/LL/y")}
                                    </>
                                ) : (
                                    format(dateRange.from, "dd/LL/y")
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
                            key={'date'}
                            initialFocus
                            mode="range"
                            defaultMonth={startDate}
                            selected={dateRange}
                            onSelect={setDateRange}
                            disabled={(date) => (today != undefined && date > today)}
                            numberOfMonths={numberOfMonth}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)
