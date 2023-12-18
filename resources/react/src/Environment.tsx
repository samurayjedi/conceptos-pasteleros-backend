import React from 'react';
import { Global } from '@emotion/react';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import store from '../store';
import { useMyTheme } from './hooks';
import { locales } from '../lib/dateFnsFacade';
// fonts
import dancingScriptRegular from '../assets/fonts/DancingScript-Regular.ttf';
import dancingScriptMedium from '../assets/fonts/DancingScript-Medium.ttf';
import dancingScriptSemiBold from '../assets/fonts/DancingScript-SemiBold.ttf';
import dancingScriptBold from '../assets/fonts/DancingScript-Bold.ttf';

export default function Environment({ children }: EnvironmentProps) {
  const theme = useMyTheme();
  const { i18n } = useTranslation();
  const language = i18n.language as Language;

  return (
    <>
      <Global
        styles={[
          {
            '@font-face': {
              fontFamily: 'Dancing Script',
              src: `url(${dancingScriptRegular})`,
              fontStyle: 'normal',
              fontWeight: 400,
            },
          },
          {
            '@font-face': {
              fontFamily: 'Dancing Script',
              src: `url(${dancingScriptMedium})`,
              fontStyle: 'normal',
              fontWeight: 500,
            },
          },
          {
            '@font-face': {
              fontFamily: 'DancingScript-Medium',
              src: `url(${dancingScriptSemiBold})`,
              fontStyle: 'normal',
              fontWeight: 600,
            },
          },
          {
            '@font-face': {
              fontFamily: 'Dancing Script',
              src: `url(${dancingScriptBold})`,
              fontStyle: 'normal',
              fontWeight: '700',
            },
          },
        ]}
      />
      <Provider store={store}>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          locale={locales[language]}
        >
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </LocalizationProvider>
      </Provider>
    </>
  );
}

export interface EnvironmentProps {
  children: React.ReactNode;
}
