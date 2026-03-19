import CashierFooterBar from "@/components/templates/CashierFooterBar";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

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
      <div className="md:pt-5 w-full flex">
        <div className="w-[1440px] m-auto">{children}</div>
      </div>

      <CashierFooterBar />
    </section>
  );
}
