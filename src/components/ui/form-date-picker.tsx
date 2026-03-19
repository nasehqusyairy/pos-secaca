import * as React from "react"

import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { format } from "date-fns"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { CalendarIcon } from "lucide-react"

export interface FormDatePickerProps
    extends React.InputHTMLAttributes<HTMLInputElement> { 
        today?: Date,
        disabled?: boolean,
    }

const FormDatePicker = React.forwardRef<HTMLInputElement, FormDatePickerProps>(
    (props: FormDatePickerProps) => {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        disabled={props.disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal bg-white",
                            // !startDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {props.today ? format(props.today, "dd/LL/y") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        disabled={props.disabled}
                        selected={props.today}
                        // onSelect={(day) => day && setStartDate(day)}
                        // props={ props }
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            //   <input
            //     type={type}
            //     className={cn(
            //       "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            //       className
            //     )}
            //     ref={ref}
            //     {...props}
            //   />
        )
    }
)
FormDatePicker.displayName = "Input"

export { FormDatePicker }
