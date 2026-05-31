import { ui, defaultLang } from './ui';

type Lang = keyof typeof ui;

export function getLang(locale: string | undefined): Lang {
  if (locale === 'es' || locale === 'en') return locale;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

