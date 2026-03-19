import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import ValidationsStorePage from "./check-toko";

const ValidateRoles = async () => {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();

  // check if user has access to the page
  if (session) {
    if (!session.user.allow_pos) {
      return redirect(`/${locale}/validate-roles`);
    }
  }

  return (
    <ValidationsStorePage />
  );
};

export default ValidateRoles;
