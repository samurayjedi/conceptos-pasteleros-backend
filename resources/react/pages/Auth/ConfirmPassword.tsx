import { useEffect } from 'react';
import route from 'ziggy-js';
import { useTranslation } from 'react-i18next';
import { Head, useForm } from '@inertiajs/react';
import { Button, Container, InputAdornment } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import TextFieldPassword from '../../piwi/core/TextFieldPassword';

export default function ConfirmPassword() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors, reset } = useForm({
    password: '',
  });

  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);

  return (
    <Container>
      <Head title="Confirm Password" />
      <div className="mb-4 text-sm text-gray-600">
        This is a secure area of the application. Please confirm your password
        before continuing.
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          post(route('password.confirm'));
        }}
      >
        <div className="mt-4">
          <TextFieldPassword
            id="signup-password"
            name="password"
            label={t('Password')}
            value={data.password}
            onChange={(event) => {
              setData(event.target.name as any, event.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            color="secondary"
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
        </div>
        <div className="flex items-center justify-end mt-4">
          <Button variant="contained" color="secondary" disabled={processing}>
            Confirm
          </Button>
        </div>
      </form>
    </Container>
  );
}
