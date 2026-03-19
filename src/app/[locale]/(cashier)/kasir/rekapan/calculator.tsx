"use client";

import { ChangeEvent, FC, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
  } from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PaymentSummary } from "@/app/api/summary/type";
  

interface CalculatorCashProps {
    paymentSummary: PaymentSummary,
    isTriggerOpen: boolean;
    onClose: (nominal: PaymentSummary) => void;
}
 
const CalculatorCash: FC<CalculatorCashProps> = ({
    paymentSummary,
    isTriggerOpen,
    onClose,
}) => {
    const initialNominal = paymentSummary?.counted_amount ?? 0;
    const [input, setInput] = useState<string>(initialNominal.toString());
  
    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    };
  
    const onClickButtonNumber = (value: string, isNumber = false) => {
      setInput((prev) => {
        const firstNumberIsZero = prev.charAt(0) === '0';
  
        if (isNumber) {
          const number = +value + +prev;
          return number.toString();
        }
        return firstNumberIsZero ? value : prev + value;
      });
    };
    
    const onClickHapusNumber = () => {
      setInput((prev) => prev.substring(0, prev.length - 1))
    }
  
    const updatePaymentSummary = (amount: number) => {
      paymentSummary.counted_amount = amount;
      paymentSummary.difference_amount = paymentSummary.recorded_amount - amount;
    };
  
    const onConfirm = () => {
      const amount = +input;
      if (amount <= 0) return;
  
      updatePaymentSummary(amount);
      onClose(paymentSummary);
    };
  
    const onCloseCalculator = () => {
      updatePaymentSummary(paymentSummary.counted_amount);
      onClose(paymentSummary);
    };

    return ( 
        <Dialog open={isTriggerOpen}>
            <DialogContent className={cn("bg-white w-full [&>button]:hidden")}>
                <DialogTitle className="text-lg md:text-2xl font-semibold">Nominal Terhitung</DialogTitle>
                <DialogDescription className="text-xs md:text-base text-muted-foreground -mt-2">Masukkan nominal sesuai uang yang didapatkan</DialogDescription>
                <div>
                    <input type="number" value={input} onChange={handleInput} className="w-full border py-2 text-lg md:text-2xl font-semibold px-4 rounded-md text-right bg-white border-primary"/>
                    <div className="mt-10 grid grid-cols-3 gap-2">
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("1")}>1</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("2")}>2</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("3")}>3</Button>

                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("4")}>4</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("5")}>5</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("6")}>6</Button>

                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("7")}>7</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("8")}>8</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("9")}>9</Button>

                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("0")}>0</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("00")}>00</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("000")}>000</Button>
                        <Button variant="secondary" className="font-semibold mt-4 text-xs md:text-base" onClick={() => onClickHapusNumber()}>Hapus</Button>
                        <Button variant="secondary" className="font-semibold mt-4 text-xs md:text-base" onClick={() => onCloseCalculator()}>Kembali</Button>
                        <Button variant="default" className="font-semibold mt-4 text-xs md:text-base" onClick={onConfirm}>Konfirm</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

     );
}
 
export default CalculatorCash;