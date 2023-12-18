import React, { useState, useEffect } from 'react';
import route from 'ziggy-js';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { Box, InputAdornment, Button } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock';
import TextFieldPassword from '../../piwi/core/TextFieldPassword';
import {
  Spacing,
  FormPaper,
  SpaceBetween,
  ErrorsAlert,
} from '../../src/auth/AuthComponents';
import Layout from '../../src/auth/Layout';

export default function ResetPassword({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const { t }: { t: (arg: string) => string } = useTranslation();
  const [openAlerts, setOpenAlerts] = useState(false);
  const { data, setData, post, processing, errors, reset } =
    useForm<ResetPasswordForm>({
      token,
      email,
      password: '',
      password_confirmation: '',
    });

  useEffect(() => () => reset('password', 'password_confirmation'), []);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setData(ev.target.name as keyof ResetPasswordForm, ev.target.value);
  };

  return (
    <Layout>
      <FormPaper label={t('Reset Password')}>
        <ErrorsAlert
          openAlerts={openAlerts}
          errors={errors}
          onClose={() => setOpenAlerts(false)}
        />
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            post(route('password.update'), {
              onFinish: () => setOpenAlerts(true),
            });
          }}
        >
          <input type="hidden" name="email" value={data.email} />
          <TextFieldPassword
            id="signup-password"
            name="password"
            label={t('Password')}
            value={data.password}
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
            value={data.password_confirmation}
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
            <Box />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              startIcon={<LockResetIcon />}
              disabled={processing}
            >
              {t('Reset Password')}
            </Button>
          </SpaceBetween>
        </form>
      </FormPaper>
    </Layout>
  );
}

export interface ResetPasswordForm {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}
