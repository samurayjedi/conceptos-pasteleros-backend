import React from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/system';
import { Link } from '@inertiajs/inertia-react';
import Tooltip from '@mui/material/Tooltip';

const style = () => ({
  color: 'white',
  textDecoration: 'none',
});

const LogoLink = styled(Link)(style);

export default function Logo() {
  const { t }: { t: (arg: string) => string } = useTranslation();

  return (
    <LogoLink href="/">
      <Tooltip title={t('Home')}>
        <img
          src="/storage/images/logo.png"
          alt="logo.png"
          height="120px"
          style={{ objectFit: 'cover' }}
        />
      </Tooltip>
    </LogoLink>
  );
}
