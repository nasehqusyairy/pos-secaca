import { FC } from "react";

interface FlexedTextProps {
  leftText: string;
  rightText: string;
}

const FlexedText: FC<FlexedTextProps> = ({ leftText, rightText }) => (
  <div className="flex justify-between">
    <p className="text-slate-500 text-xs md:text-lg">{leftText}</p>
    <p className="text-slate-500 font-semibold text-sm md:text-lg">{rightText}</p>
  </div>
);

export default FlexedText;
