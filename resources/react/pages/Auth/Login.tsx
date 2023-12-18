import { useTranslation } from 'react-i18next';
import route from 'ziggy-js';
import { Link, usePage, router } from '@inertiajs/react';
import { Form, Field } from 'react-final-form';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import TextFieldPassword from '../../piwi/core/TextFieldPassword';
import { useErrors } from '../../src/hooks';
import {
  Spacing,
  FormPaper,
  SpaceBetween,
  FormFooterStyled,
} from '../../src/auth/AuthComponents';
import Layout from '../../src/auth/Layout';

export default function LoginForm() {
  const { canResetPassword } = usePage().props;
  const { t }: { t: (arg: string) => string } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();

  return (
    <Form
      subscription={{ submitting: true, pristine: true }}
      onSubmit={(data) => router.post(route('login'), data)}
      render={({ /** pristine, */ submitting, handleSubmit }) => {
        const processing = submitting; // && pristine

        return (
          <Layout>
            <FormPaper label={t('Login')}>
              <form onSubmit={handleSubmit}>
                <Field
                  name="email"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextField
                      {...input}
                      id="signin-user"
                      label={t('Email')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      color="secondary"
                      onChange={onChangeDecorator(input.onChange)}
                      error={Boolean(fuckErrors[input.name])}
                      helperText={fuckErrors[input.name]}
                    />
                  )}
                />
                <Spacing />
                <Field
                  name="password"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextFieldPassword
                      {...input}
                      label={t('Password')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKeyIcon />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      color="secondary"
                      onChange={onChangeDecorator(input.onChange)}
                      error={Boolean(fuckErrors[input.name])}
                      helperText={fuckErrors[input.name]}
                    />
                  )}
                />
                <SpaceBetween>
                  <Field
                    name="remember"
                    subscription={{ value: true }}
                    render={({ input }) => (
                      <FormControlLabel
                        name={input.name}
                        control={
                          <Checkbox
                            checked={input.value}
                            onChange={input.onChange}
                            color="secondary"
                          />
                        }
                        label={t('Remember me')}
                      />
                    )}
                  />

                  {canResetPassword === true && (
                    <Link href="/forgot-password">
                      {t('Forgot your password?')}
                    </Link>
                  )}
                </SpaceBetween>
                <SpaceBetween paddingTop={0}>
                  <Box>
                    <Tooltip title={t('Login via Google')}>
                      <IconButton>
                        <GoogleIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('Login via Facebook')}>
                      <IconButton>
                        <FacebookIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    startIcon={<LockOpenIcon />}
                    disabled={processing}
                  >
                    {t('Login')}
                  </Button>
                </SpaceBetween>
              </form>
              <FormFooterStyled>
                <Typography variant="subtitle1">
                  {t('No account?')}
                  &nbsp;
                  <Link href="/register">{t('Create one now!')}</Link>
                </Typography>
              </FormFooterStyled>
            </FormPaper>
          </Layout>
        );
      }}
    />
  );
}
