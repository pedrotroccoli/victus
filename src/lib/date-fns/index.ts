import { format } from 'date-fns';
import { enUS, es, ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const locales = {
  en: enUS,
  es: es,
  'pt-BR': ptBR,
}

const formatDate = (date: Date, formatString: string, locale: string) => {
  return format(date, formatString, { locale: locales[locale as keyof typeof locales] });
}

export const useDate = () => {
  const { i18n } = useTranslation();

  const formatDate = (date: Date, formatString: string) => {
    return format(date, formatString, { locale: locales[i18n.language as keyof typeof locales] }); }

  return { formatDate };
}


export { formatDate };
