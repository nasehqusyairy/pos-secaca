import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import ValidationsRolesPage from "./check-roles";

const ValidateRoles = async () => {
    const session = await getServerSession(authOptions);
    const locale = await getLocale();
    
    // check if user has access to the page
    if (session) {
        if (!session.user.allow_pos && session.user.allow_backoffice) {
            return redirect(`/${locale}/backoffice/dashboard`);
        } 
        
        if (session.user.allow_pos && !session.user.allow_backoffice) {
            return redirect(`/${locale}/validate-toko`);
        }
    }

    return (
        <ValidationsRolesPage />
     );
}
 
export default ValidateRoles;