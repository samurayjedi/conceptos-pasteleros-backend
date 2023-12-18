import { useMemo, useState, useEffect } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { createTheme } from '@mui/material/styles';
import { esES, enUS } from '@mui/material/locale';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const MaterialLocales = {
  'es-ES': esES,
  'en-US': enUS,
} as const;

export function useMyTheme() {
  const { i18n } = useTranslation();
  const { language } = i18n;
  const themeWithLocale = useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode: 'dark',
            primary: {
              main: '#243c86',
              light: '#5a71b4',
              dark: '#182c70',
            },
            secondary: {
              main: '#f26c20',
              light: '#ffa738',
              dark: '#e8531e',
            },
          },
          /*
          typography: { ...fontFamily },
          h1: { ...fontFamily },
          h2: { ...fontFamily },
          h3: { ...fontFamily },
          h4: { ...fontFamily },
          h5: { ...fontFamily },
          h6: { ...fontFamily },
          subtitle1: { ...fontFamily },
          subtitle2: { ...fontFamily },
          body1: { ...fontFamily },
          body2: { ...fontFamily },
          button: { ...fontFamily },
          caption: { ...fontFamily },
          overline: { ...fontFamily },
          */
        },
        MaterialLocales[language as keyof typeof MaterialLocales],
      ),
    [language],
  );

  return themeWithLocale;
}

export function useErrors() {
  const { errors } = usePage().props;
  const [fuckErrors, setFuckErrors] = useState(errors);

  useEffect(() => {
    setFuckErrors(errors);
  }, [errors]);

  const removeError = (key: string) =>
    setFuckErrors((prev) => _.omit(prev, key));

  const onChangeDecorator =
    (onChange: (vacaEv: any, ...vacaArgs: any) => void) =>
    (ev: any, ...args: any) => {
      onChange(ev, ...args);
      const name = _.get(ev, 'target.name', null);
      if (name) {
        if (_.has(fuckErrors, name)) {
          removeError(name);
        }
      }
    };

  return [fuckErrors, onChangeDecorator, removeError] as const;
}
