import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import i18nTranslator from 'i18next';
import { initReactI18next } from 'react-i18next';
import BrowserLanguageDetector from 'i18next-browser-languagedetector';
import Environment from './src/Environment';
import AppLayout from './src/AppLayout';
import enUS from './assets/lang/en-US.json';
import esES from './assets/lang/es-ES.json';

i18nTranslator
  .use(initReactI18next)
  .use(BrowserLanguageDetector)
  .init({
    fallbackLng: 'en-US',
    resources: {
      'en-US': {
        translation: enUS,
      },
      'es-ES': {
        translation: esES,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

createInertiaApp({
  progress: {
    color: '#f26c20',
  },
  title: (title) => `${title} | Conceptos`,
  resolve: async (name) => {
    const Page = (await import(`./pages/${name}`)).default;

    if (!Page) {
      throw new Error(`${name} not exists!!!`);
    }
    Page.layout = Page.layout || AppLayout;

    return Page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <React.Suspense fallback="Loading....">
        <Environment>
          <App {...props} />
        </Environment>
      </React.Suspense>,
    );
  },
});
