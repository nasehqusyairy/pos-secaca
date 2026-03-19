import { FC } from "react";

interface FooterProps {
    
}
 
const Footer: FC<FooterProps> = () => {
    return ( 
        <footer className="bg-primary text-white text-center py-5 mt-14">
            <div className="container mx-auto">
                <p>© 2024 All rights reserved</p>
            </div>
        </footer>
     );
}
 
export default Footer;