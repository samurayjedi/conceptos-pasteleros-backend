import React, { useState, useCallback, ReactNode } from 'react';
import _ from 'lodash';
import { Paper, Typography, Container, ContainerProps } from '@mui/material';
import styled from '@emotion/styled';
import { usePage } from '@inertiajs/react';
import MyBreadcrumbs from './MyBreadcrumbs';
import Snackbar from '../piwi/core/Snackbar';

export default function FormLayout({ children, ...props }: ContainerProps) {
  const { snackbar } = usePage().props;
  const [open, setOpen] = useState(Boolean(snackbar));
  const closeSnackbar = useCallback(() => setOpen(false), []);

  return (
    <>
      <Container maxWidth="lg" {...props}>
        <MyBreadcrumbs />
        <FormLayoutPaper>{children}</FormLayoutPaper>
      </Container>
      <Snackbar
        open={open}
        onClose={closeSnackbar}
        severity={_.get(snackbar, 'severity')}
      >
        {_.get(snackbar, 'message', '')}
      </Snackbar>
    </>
  );
}

export function Section({ children, title }: SectionProps) {
  return (
    <>
      <Header>
        <Typography
          variant="subtitle1"
          className={`section-header-title section-header-${_.snakeCase(
            title,
          )}`}
        >
          {title}
        </Typography>
      </Header>
      <Root>{children}</Root>
    </>
  );
}

const FormLayoutPaper = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
});

const Header = styled.div(({ theme }) => ({
  width: 'fit-content',
  overflow: 'hidden',
  position: 'relative',
  padding: '4px 0',
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(3),
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: -7,
    zIndex: 1,
    width: '100%',
    height: 31,
    backgroundColor: theme.palette.secondary.main,
    transform: 'skew(-20deg)',
  },
  '& .section-header-title': {
    position: 'relative',
    zIndex: 2,
    color: theme.palette.common.white,
  },
}));

const Root = styled.div(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  color: 'rgba(0, 0, 0, 0.6)',
}));

export interface SectionProps {
  children: ReactNode;
  title: string;
}
