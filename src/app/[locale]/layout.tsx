import "../globals.css";
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import NextAuthProvider from "@/context/NextAuthProvider";
import QueryClientProviderPage from "@/components/templates/QueryClientPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions);

  const selectedEntity = (session?.user as any)?.selected_entity;
  const entityId = selectedEntity?.id ?? 3;
  const isSecaca = entityId === 1 || selectedEntity?.code === "secaca";

  const rawName = selectedEntity?.name ?? (isSecaca ? "Secaca" : "Zakiah");
  const brandName = session
    ? rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase()
    : "Zakiah & Secaca";
  const logoName = isSecaca ? "secaca.png" : "zakiah.png";

  return {
    title: `${brandName} POS`,
    icons: {
      icon: `/images/${logoName}`,
      shortcut: `/images/${logoName}`,
      apple: `/images/${logoName}`,
    },
  };
}

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <QueryClientProviderPage>
            <NextAuthProvider>
              {children}
            </NextAuthProvider>
          </QueryClientProviderPage>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}