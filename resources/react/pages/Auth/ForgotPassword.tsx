import React, { useState } from 'react';
import route from 'ziggy-js';
import { useTranslation } from 'react-i18next';
import { Link, useForm } from '@inertiajs/react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import {
  Spacing,
  FormPaper,
  SpaceBetween,
  ErrorsAlert,
  FormFooterStyled,
} from '../../src/auth/AuthComponents';
import Layout from '../../src/auth/Layout';

export interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPassword({ status }: { status: string }) {
  const { t }: { t: (arg: string) => string } = useTranslation();
  const [openAlerts, setOpenAlerts] = useState(false);
  const { data, setData, post, processing, errors } =
    useForm<ForgotPasswordForm>({
      email: '',
    });
  const { email } = data;

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setData(ev.target.name as keyof ForgotPasswordForm, ev.target.value);
  };

  return (
    <Layout>
      <FormPaper label={t('Forgot Password?')}>
        {status && (
          <Collapse in={openAlerts} className="alert">
            <Alert onClose={() => setOpenAlerts(false)}>{status}</Alert>
          </Collapse>
        )}
        <ErrorsAlert
          openAlerts={openAlerts}
          errors={errors}
          onClose={() => setOpenAlerts(false)}
        />
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            post(route('password.email'), {
              onFinish: () => setOpenAlerts(true),
            });
          }}
        >
          <Typography variant="subtitle1">{t('@forgotPassword/p1')}</Typography>
          <Spacing />
          <TextField
            id="signin-user"
            name="email"
            label={t('Email')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            value={email || ''}
            onChange={handleChange}
            fullWidth
            color="secondary"
          />
          <Spacing />
          <SpaceBetween paddingTop={0}>
            <Box />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              startIcon={<EmailIcon />}
              disabled={processing}
            >
              {t('Send Reset Link')}
            </Button>
          </SpaceBetween>
        </form>
        <FormFooterStyled>
          <Typography variant="subtitle1">
            {t('Are you remember?')}
            &nbsp;
            <Link href={route('login')}>{t('Login now!')}</Link>
          </Typography>
        </FormFooterStyled>
      </FormPaper>
    </Layout>
  );
}
