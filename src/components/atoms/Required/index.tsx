import { FC } from "react";

interface RequiredLabelProps {
}
 
const RequiredLabel: FC<RequiredLabelProps> = () => (
    <span className="text-red-600"> *</span>
  );
 
export default RequiredLabel;