import "../globals.css";
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import NextAuthProvider from "@/context/NextAuthProvider";
import QueryClientProviderPage from "@/components/templates/QueryClientPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { headers } from "next/headers";
import type { Metadata } from "next";

function formatPathToTitle(pathname: string): string {
  if (!pathname || pathname === "/") return "";
  const segments = pathname.split("/").filter(Boolean);
  
  const filteredSegments = segments.filter(seg => seg !== 'id' && seg !== 'en');
  
  if (filteredSegments.length === 0) return "";
  
  const lastSegment = filteredSegments[filteredSegments.length - 1];
 
  return lastSegment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || 
                   headersList.get("next-url") || 
                   headersList.get("referer") || 
                   "";

  const pageTitle = formatPathToTitle(pathname);

  const selectedEntity = (session?.user as any)?.selected_entity;
  const entityId = selectedEntity?.id ?? 3;
  const isSecaca = entityId === 1 || selectedEntity?.code === "secaca";

  const rawName = selectedEntity?.name ?? (isSecaca ? "Secaca" : "Zakiah");
  const brandName = session ? (rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase()) : "Zakiah & Secaca";
  const logoName = isSecaca ? "secaca.png" : "zakiah.png";

  const fullTitle = pageTitle ? `${pageTitle} | ${brandName} POS & Backoffice` : `${brandName} POS & Backoffice`;

  return {
    title: fullTitle,
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