import route from 'ziggy-js';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';
import styled from '@emotion/styled';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CookieIcon from '@mui/icons-material/Cookie';
import FormLayout, { Section } from '../src/FormLayout';
import MyBreadcrumbs from '../src/MyBreadcrumbs';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <FormLayout>
      <Section title={t('Forms')}>
        <Grid container spacing={4}>
          <Grid item>
            <MyButton
              variant="contained"
              startIcon={<CookieIcon />}
              LinkComponent={Link}
              href={route('recipes')}
            >
              {t('Recipes')}
            </MyButton>
          </Grid>
        </Grid>
      </Section>
    </FormLayout>
  );
}

const MyButton = styled(Button)(({ theme }) => ({
  width: 140,
  height: 140,
  display: 'flex',
  flexFlow: 'column',
  borderRadius: 0,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[800],
  textTransform: 'none',
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.grey[700],
  },
  '& .MuiButton-startIcon': {
    margin: 0,
    marginBottom: theme.spacing(2),
    '& svg': {
      fontSize: 48,
    },
  },
}));
