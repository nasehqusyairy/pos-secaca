import { getServerSession } from "next-auth";
import "../../globals.css";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { getLocale } from "next-intl/server";
 
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    // get cookies server side 
    const session = await getServerSession(authOptions);
    const locale = await getLocale();

    if (session === null) {
      return redirect(`/${locale}/auth/signin`);
    }

    return (
        <section>
            {children}
        </section>
    );
}
