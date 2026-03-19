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
import { FaDeleteLeft } from "react-icons/fa6";
import { Catalogues } from "@/app/api/catalogues/type";

enum discountMode {
    all = "",
    discount = "discount"
};
  
interface DiscountProps {
    total: number,
    isTriggerOpen: boolean;
    product: Catalogues | null;
    mode?: discountMode | null;
    onClose: () => void;
    onSubmit: (diskon: number, state: string) => void;
}
 
const Discount: FC<DiscountProps> = ({
    total,
    isTriggerOpen,
    product,
    mode,
    onClose,
    onSubmit
}) => {
    const [input, setInput] = useState<string>("0");
    const [state, setState] = useState<string>('');
    const [error, setError] = useState<string>("");
    const [currentDiscountMode, setCurrentDiscountMode] = useState<discountMode>(mode ?? discountMode.all);

    const handleInput = (e: any) => {
        setInput(e.target.value);
    }

    useEffect(() => {
        setError("")

        const adjustmentAmount = +input
        if (state !== "%") {
            const maxAmount = 5000

            if (Math.abs(adjustmentAmount) > maxAmount) {
                setError(`${buildDiscountLabel(true)} tidak bisa lebih dari ${maxAmount}`)
                return;
            }
        }

        if (state === "%") {
            if (+input > 100) {
                setError(buildDiscountLabel(true) +" persen tidak bisa lebih dari 100%")
                return;
            }
        } else if (state === "-") {
            const tempTotal = total + (+input)
            
            if (tempTotal < 0 ) {
                setError(buildDiscountLabel(true) + " tidak bisa melebihi total order")
                return;
            }
        }
    }, [input, state]);
    
    const onClickButtonNumber = (value: string) => {
        setInput((prev) => {
            let data = prev;

            const firstChar = data.charAt(0);
            if (firstChar === "-") {
                const isNol = data.charAt(1)
                if (isNol === "0") {
                    data = "-" + data.slice(1, 1) + prev.slice(2)
                }
            }

            if (data === "0") {
                return value;
            } else {
                return data + value;
            }
        });
    }

    const onConfirm = () => {
        if (input && +input == 0) {
            return;
        }

        onSubmit(+input, state)
    }

    const onClickState = (data: string) => {
        if(data === "-") {
            const firstChar = input.charAt(0);
            if (firstChar !== "-") {
                setInput((prev) => '-' + prev)
            } else {
                setInput((prev) => prev.slice(1))
                // setState("")
            }
            return;
        } else if (data === "%") {
            setState((prev) => {
                if(prev === data) return ""
    
                return data
            });
        } else if (data === "") { // delete
            const length = input.length;

            if(length == 2) {
                const firstInput = input.charAt(0);

                if (firstInput == '-') {
                    setInput('0')
                } else {
                    setInput((prev) => prev.slice(0, -1))
                }
            }
            else if (length > 1) {
                setInput((prev) => prev.slice(0, -1))
            }
            else if (length === 1) {
                const firstInput = input.charAt(1);
                if(firstInput === '-') setInput((prev) => '-' + prev)
                else onReset() 
            }
        } 
    }

    const onReset = () => {
        setInput("0")
        setState("")
        setError("")
    }

    useEffect(() => {
        onReset()
    }, [isTriggerOpen]);

    useEffect(() => {
        if (product) {
            onClickState('-')
            setCurrentDiscountMode(discountMode.discount)
        } else {
            setCurrentDiscountMode(discountMode.all)
        }
    }, [product]);

    const buildDiscountLabel = (capital: boolean = false) => {
        let label = ''
        switch (currentDiscountMode) {
            case discountMode.all:
                label = 'penyesuaian'
                break;
            default:
                label = 'diskon'
                break;
        }
        
        if (capital) {
            label = label.charAt(0).toUpperCase() + label.slice(1)
        }

        return label
    }

    return ( 
        <Dialog open={isTriggerOpen}>
            <DialogContent className={cn("bg-white w-96 rounded-md md:w-full [&>button]:hidden")}>
                <DialogTitle className="text-lg md:text-2xl font-semibold">{buildDiscountLabel(true)} {product && product.name}</DialogTitle>
                <DialogDescription className="text-xs md:text-sm text-muted-foreground -mt-2">Masukkan {buildDiscountLabel()} yang tersedia</DialogDescription>
                <div>
                    <div className="flex gap-2">
                        <input type="number" value={input} onChange={handleInput} className="w-full border py-2 text-2xl font-semibold px-4 rounded-md text-right bg-white"/>
                        {
                            state && (<div className="w-[60px] bg-primary text-white flex items-center rounded-md justify-center">
                                <p>{state}</p>
                            </div>)
                        }
                    </div>
                    {error && <p className="pt-1 text-red-500 text-sm"> {error}</p>}
                    <div className="mt-10 grid grid-cols-4 gap-2">
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("1")}>1</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("2")}>2</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("3")}>3</Button>
                        <Button variant={state === '%' ? 'default' : 'secondary'} className={`font-semibold`} onClick={() => onClickState("%")}>%</Button>

                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("4")}>4</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("5")}>5</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("6")}>6</Button>
                        <Button variant={state === '-' ? 'default' : 'secondary'} className="font-semibold" onClick={() => onClickState("-")} disabled={product != null}>-</Button>

                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("7")}>7</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("8")}>8</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("9")}>9</Button>
                        <Button variant="secondary" className="font-semibold" onClick={() => onClickState("")}><FaDeleteLeft /></Button>


                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("0")}>0</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("00")}>00</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("000")}>000</Button>
                        <Button variant="secondary" className="font-semibold text-base md:text-lg" onClick={() => onClickButtonNumber("000")}>0000</Button>

                        <Button variant="secondary" className="font-semibold mt-4 text-xs md:text-base" onClick={onReset}>Reset</Button>
                        <Button variant="secondary" className="font-semibold mt-4 text-xs md:text-base" onClick={() => onClose()}>Kembali</Button>
                        <Button variant="default" className="font-semibold col-span-2 mt-4 text-xs md:text-base" onClick={onConfirm} disabled={!!error}>Konfirm</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

     );
}
 
export default Discount;