/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
import styled from '@emotion/styled';
import _ from 'lodash';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import route from 'ziggy-js';
import { Box, Breadcrumbs } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function MyBreadcrumbs() {
  const { t } = useTranslation();
  const { pathname } = window.location;
  const paths = pathname
    .split('/')
    .filter((path) => path !== 'id' && isNaN(parseInt(path)));

  return (
    <BreadcrumbsAndExit>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          mt: 4,
          mb: 1,
        }}
      >
        {paths.map((path, index) => (
          <>
            {(() => {
              switch (path) {
                case '':
                  return (
                    <Link
                      href="/"
                      style={{ textDecoration: 'none', color: 'white' }}
                    >
                      <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                      {t('Home')}
                    </Link>
                  );
                default:
                  return index < paths.length - 1 ? (
                    <Link
                      href={route(path)}
                      style={{ textDecoration: 'none', color: 'white' }}
                    >
                      {t(_.startCase(path))}
                    </Link>
                  ) : (
                    <span>{t(_.startCase(path))}</span>
                  );
              }
            })()}
          </>
        ))}
      </Breadcrumbs>
      <Box sx={{ flex: 1 }} />
      <Link
        href={route('logout')}
        style={{ textDecoration: 'none', color: 'white' }}
        method="post"
      >
        <ExitToAppIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        {t('Salir')}
      </Link>
    </BreadcrumbsAndExit>
  );
}

const BreadcrumbsAndExit = styled.div({
  display: 'flex',
  alignItems: 'flex-end',
});
