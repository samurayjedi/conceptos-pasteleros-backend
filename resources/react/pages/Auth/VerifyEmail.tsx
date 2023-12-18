import React, { useState } from 'react';
import route from 'ziggy-js';
import { Link, useForm } from '@inertiajs/react';
import { Alert, Collapse, Typography, Paper, Button } from '@mui/material';
import { SpaceBetween } from '../../src/auth/AuthComponents';
import Layout from '../../src/auth/Layout';

export default function VerifyEmail({ status }: { status: string }) {
  const { post, processing } = useForm();
  const [openAlerts, setOpenAlerts] = useState(false);

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    post(route('verification.send'), {
      onFinish: () => setOpenAlerts(true),
    });
  };

  return (
    <Layout>
      <Paper sx={{ width: '500px', p: 4 }}>
        <Typography variant="subtitle1">
          Thanks for signing up! Before getting started, could you verify your
          email address by clicking on the link we just emailed to you? If you
          didnt receive the email, we will gladly send you another.
        </Typography>
        {status === 'verification-link-sent' && (
          <Collapse in={openAlerts} className="alert">
            <Alert onClose={() => setOpenAlerts(false)}>
              A new verification link has been sent to the email address you
              provided during registration.
            </Alert>
          </Collapse>
        )}
        <form onSubmit={submit}>
          <SpaceBetween>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={processing}
            >
              Resend Verification Email
            </Button>
            <Link href={route('logout')} method="post" as="button">
              Log Out
            </Link>
          </SpaceBetween>
        </form>
      </Paper>
    </Layout>
  );
}
