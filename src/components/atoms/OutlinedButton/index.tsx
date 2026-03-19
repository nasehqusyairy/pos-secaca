import { FC } from "react";
import { Button } from "@/components/ui/button";

interface OutlinedButtonProps {
  variant: string;
  text: string;
  selected?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const OutlinedButton: FC<OutlinedButtonProps> = ({
  variant,
  text,
  onClick,
  selected = true,
}) => {
  const buttonClass = selected ? `border-${variant}-500 bg-primary text-white hover:bg-white hover:text-primary` : `border-${variant}-500 text-primary bg-white hover:bg-${variant}-500 hover:text-white`;

  return (
      <Button
      variant="outline"
      className={buttonClass}
      onClick={onClick}
    >
        <span className="text-xs md:text-base">{text}</span>
    </Button>
    );
};

export default OutlinedButton;
