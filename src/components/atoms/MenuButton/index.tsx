import { Button } from "@/components/ui/button";
import { FC } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

interface MenuButtonProps {
    label: string;
    icon: JSX.Element;
    isOpen: boolean;
    onClick: () => void;
}
 
const MenuButton: FC<MenuButtonProps> = ({ label, icon, isOpen, onClick }) => (
    <Button variant={"ghost"} className="w-full justify-start hover:text-primary" onClick={onClick}>
      <span className="flex-1 text-left whitespace-nowrap flex flex-row items-center">
        {icon}
        {label}
      </span>
      {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
    </Button>
  );
 
export default MenuButton;