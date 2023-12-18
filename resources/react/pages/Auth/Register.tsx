import React, { useState, useEffect } from 'react';
import route from 'ziggy-js';
import { useTranslation } from 'react-i18next';
import { Link, useForm } from '@inertiajs/react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Icons
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
// Internal Dependencies
import {
  Spacing,
  FormPaper,
  SpaceBetween,
  ErrorsAlert,
  FormFooterStyled,
} from '../../src/auth/AuthComponents';
import TextFieldPassword from '../../piwi/core/TextFieldPassword';
import Layout from '../../src/auth/Layout';

export default function Register() {
  const { t }: { t: (arg: string) => string } = useTranslation();
  const [openAlerts, setOpenAlerts] = useState(false);
  const { data, setData, post, processing, errors, reset } =
    useForm<SignUpForm>({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
  const { name, email, password, password_confirmation } = data;

  useEffect(
    () => () => {
      reset('password', 'password_confirmation');
    },
    [],
  );

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setData(ev.target.name as keyof SignUpForm, ev.target.value);
  };

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => setOpenAlerts(true),
    });
  };

  return (
    <Layout>
      <FormPaper label={t('Register')}>
        <ErrorsAlert
          openAlerts={openAlerts}
          errors={errors}
          onClose={() => setOpenAlerts(false)}
        />
        <form id="rico-signup-form" onSubmit={submit}>
          <TextField
            id="signup-email"
            name="email"
            label={t('Email')}
            value={email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            color="secondary"
          />
          <Spacing />
          <TextField
            id="signup-name"
            name="name"
            label={t('First & Last Name')}
            value={name}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            color="secondary"
          />
          <Spacing />
          <TextFieldPassword
            id="signup-password"
            name="password"
            label={t('Password')}
            value={password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            color="secondary"
          />
          <Spacing />
          <TextFieldPassword
            id="signup-verify-password"
            name="password_confirmation"
            label={t('Verify Password')}
            value={password_confirmation}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            color="secondary"
          />
          <Spacing />
          <SpaceBetween paddingTop={0}>
            <Box>
              <Tooltip title={t('Register via Google')}>
                <IconButton>
                  <GoogleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('Register via Facebook')}>
                <IconButton>
                  <FacebookIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              startIcon={<HowToRegIcon />}
              disabled={processing}
            >
              {t('Register')}
            </Button>
          </SpaceBetween>
        </form>
        <FormFooterStyled>
          <Typography variant="subtitle1">
            {t('Already have one?')}
            &nbsp;
            <Link href={route('login')}>{t('Login now!')}</Link>
          </Typography>
        </FormFooterStyled>
      </FormPaper>
    </Layout>
  );
}

export interface SignUpForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
