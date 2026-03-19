"use client";

import { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetOrderTypeQuery } from "@/app/api/order-type/queries";
import { IoIosArrowDown } from "react-icons/io";

interface DropdownMenuOrderTypeProps {
  order: any;
  setOrder: any;
}

const DropdownMenuOrderType: FC<DropdownMenuOrderTypeProps> = ({
  order,
  setOrder,
}) => {
  const { data, isPending } = useGetOrderTypeQuery(10, 'active');

  useEffect(() => {
    if (data?.data && data.data.length > 0 && !order) {
      setOrder(data.data[0]);
    }
  }, [data, order, setOrder]);

  return (
    <>
      {!isPending && data?.data && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center border-2 border-primary bg-white text-primary hover:bg-primary-100 text-xs md:text-sm">
              {order?.name || "Select Order Type"}
              <IoIosArrowDown className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={order} onValueChange={setOrder}>
              {data.data.map((val: any) => (
                <DropdownMenuRadioItem className="text-xs md:text-sm" key={val.name} value={val}>
                  {val.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default DropdownMenuOrderType;
