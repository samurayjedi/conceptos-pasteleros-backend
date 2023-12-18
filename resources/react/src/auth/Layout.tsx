import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { Container, ContainerProps } from '@mui/material';
import Logo from '../Logo';

export default function Layout({ children }: { children: ReactNode }) {
  return <FormContainer>{children}</FormContainer>;
}

export function FormContainer({ children, ...rest }: ContainerProps) {
  return (
    <MyContainer maxWidth={false} disableGutters {...rest}>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      {children}
    </MyContainer>
  );
}

const MyContainer = styled(Container)(({ theme }) => ({
  width: '100vw',
  minHeight: '100vh',
  height: 'fit-content',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const LogoWrapper = styled.div(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));
