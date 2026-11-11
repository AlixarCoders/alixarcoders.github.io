import { index } from '../i18n/index';
import { blog } from '../i18n/blog';
import { navbar } from '../i18n/navbar';


const translations = {
    es: {
        ...index.es,
        ...blog.es,
        ...navbar.es
    },
    en: {
        ...index.en,
        ...blog.en,
        ...navbar.en
    },
};

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in translations) return lang as keyof typeof translations;
    return 'es';
}

export function useTranslations(lang: keyof typeof translations) {
    return function t(key: keyof typeof translations['es']) {
        return translations[lang][key] || translations['es'][key];
    };
}