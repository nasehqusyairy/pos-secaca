import "../globals.css";
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import NextAuthProvider from "@/context/NextAuthProvider";
import QueryClientProviderPage from "@/components/templates/QueryClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zakiah & Secaca POS",
  icons: {
    icon: "/images/zakiah.png",
    shortcut: "/images/zakiah.png",
    apple: "/images/zakiah.png",
  },
};

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