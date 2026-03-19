import { Button } from "@/components/ui/button"
import {useLocale, useTranslations} from 'next-intl';
import { redirect } from "next/navigation";

export default function Home() {

  const t = useTranslations();
  const locale = useLocale();

  redirect(`/${locale}/auth/signin`);

  return (
    <div className="h-[2000px] bg-red-50 p-10">
      <h1>{t('title')}</h1>
      <Button>Click me</Button>
    </div>
  );
}
