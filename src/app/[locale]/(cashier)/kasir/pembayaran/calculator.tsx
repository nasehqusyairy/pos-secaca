"use client";

import { FC, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
  } from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
  

interface CalculatorCashProps {
    total: number;
    isTriggerOpen: boolean;
    onClose: (nominal: number) => void;
}
 
const CalculatorCash: FC<CalculatorCashProps> = ({
    total,
    isTriggerOpen,
    onClose,
}) => {
    const [input, setInput] = useState<string>("0");

    const handleInput = (e: any) => {
        setInput(e.target.value);
    }
    
    const onClickButtonNumber = (value: string, isNumber = false) => {
        setInput((prev) => {
            if (isNumber) {
                const number = +value + +prev;
                return number.toString();
            } else if (prev === "0") {
                return value;
            } else {
                return prev + value;
            }
        });
    }

    const onClickUangPas = () => {
        setInput(total.toString());
    }

    const onConfirm = () => {
        if (input && +input <= 0) {
            return;
        }

        onClose(input ? +input : 0);
    }

    useEffect(() => {
        setInput("0");
    }, [isTriggerOpen]);

    return ( 
        <Dialog open={isTriggerOpen}>
            <DialogContent className={cn("bg-white w-96 rounded-md md:w-full [&>button]:hidden")}>
                <DialogTitle className="text-lg md:text-2xl font-semibold">Metode Tunai</DialogTitle>
                <DialogDescription className="text-xs md:text-sm text-muted-foreground -mt-2">Masukkan nominal sesuai uang yang diberikan oleh member</DialogDescription>
                <div>
                    <input type="number" value={input} onChange={handleInput} className="w-full border py-2 text-2xl font-semibold px-4 rounded-md text-right bg-white"/>
                    <div className="mt-10 grid grid-cols-4 gap-2">
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("1")}>1</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("2")}>2</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("3")}>3</Button>
                        <Button variant="secondary" className="font-semibold" onClick={() => onClickButtonNumber("10000", true)}>10.000</Button>

                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("4")}>4</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("5")}>5</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("6")}>6</Button>
                        <Button variant="secondary" className="font-semibold" onClick={() => onClickButtonNumber("20000", true)}>20.000</Button>

                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("7")}>7</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("8")}>8</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("9")}>9</Button>
                        <Button variant="secondary" className="font-semibold" onClick={() => onClickButtonNumber("50000", true)}>50.000</Button>

                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("0")}>0</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("00")}>00</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("000")}>000</Button>
                        <Button variant="secondary" className="font-semibold" onClick={() => onClickButtonNumber("100000", true)}>100.000</Button>

                        <Button variant="secondary" className="font-semibold mt-4 text-xs md:text-base" onClick={onClickUangPas}>Uang Pas</Button>
                        <Button variant="secondary" className="font-semibold mt-4 text-xs md:text-base" onClick={() => onClose(0)}>Kembali</Button>
                        <Button variant="default" className="font-semibold col-span-2 mt-4 text-xs md:text-base" onClick={onConfirm}>Konfirm</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

     );
}
 
export default CalculatorCash;