import i18next from 'i18next';
import { format as datefnsFormat, parse as datefnsParse } from 'date-fns';
import enUSLocale from 'date-fns/locale/en-US';
import esESLocale from 'date-fns/locale/es';

const language = (i18next.language as Language) || 'en-US';

export const locales = {
  'en-US': enUSLocale,
  'es-ES': esESLocale,
} as const;

export const dateFormats = {
  'en-US': 'yyyy-MM-dd',
  'es-ES': 'dd-MM-yyyy',
};

export function format(date: Date, sf: string = dateFormats[language]) {
  return datefnsFormat(date, sf, {
    locale: locales[language],
  });
}

export function parse(
  date: string,
  sf: string = dateFormats[language],
  ref: Date = new Date(),
) {
  return datefnsParse(date, sf, ref, {
    locale: locales[language],
  });
}
