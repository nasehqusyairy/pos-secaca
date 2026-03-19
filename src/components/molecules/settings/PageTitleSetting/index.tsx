import { FC } from "react";

interface PageTitleSettingProps {
    title: string;
    subtitle?: string;
}
 
const PageTitleSetting: FC<PageTitleSettingProps> = ({title, subtitle}) => {
    return ( 
        <div className="my-5">
            <div className="text-lg font-semibold">{title}</div>
            {
                subtitle ? <div className="text-gray-400"> {subtitle} </div>: <></>
            }
            
        </div>
     );
}
 
export default PageTitleSetting;