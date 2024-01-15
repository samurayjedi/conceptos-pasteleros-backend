import React, { useCallback, useContext, useMemo, useState } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import arrayMutators from 'final-form-arrays';
import { Form, Field, FormSpy } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  Button,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  FormLabel,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  IconButton,
} from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import LabelIcon from '@mui/icons-material/Label';
import AddIcon from '@mui/icons-material/Add';
import { useErrors } from '../../../src/hooks';
import FormLayout, { Section } from '../../../src/FormLayout';
import Preparation from './Preparation';
import PiwiEditor from './PiwiEditor';
import Cover from './Cover';
import SelectMultiple from '../../../piwi/core/SelectMultiple';
import CategoryDialog from './CategoryDialog';
import TextFieldCurrency from '../../../piwi/core/TextFieldCurrency';
import useOnSubmit from './hooks';

const INITIAL_VALUES = {
  categories: [],
  preparations: [
    {
      name: '',
      ingredients: [{ name: '', weight: '' }],
      instructions: '',
    },
  ],
};

export const CTX = React.createContext<NewPreparationCtx>({
  categoriesDialogOpen: false,
  setCategoriesDialogOpen: () => {
    //
  },
  values: INITIAL_VALUES,
});

export default function RecipeForm({
  action,
  values = INITIAL_VALUES,
}: RecipeFormProps) {
  const { t } = useTranslation();
  const savedInstanceState = router.restore();
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const piwi = useMemo(
    () => ({ categoriesDialogOpen, setCategoriesDialogOpen, values }),
    [categoriesDialogOpen],
  );
  const onSubmit = useOnSubmit(action);

  return (
    <CTX.Provider value={piwi}>
      <FormLayout>
        <Section title={t('Recipe')}>
          <Form
            initialValues={_.defaults(savedInstanceState, values, {
              cover: '',
            })}
            mutators={{
              ...arrayMutators,
            }}
            subscription={{ submitting: true, pristine: true }}
            onSubmit={onSubmit}
            render={({ /** pristine, */ submitting, handleSubmit }) => {
              const processing = submitting; // && pristine

              return (
                <PiwiForm id="piwi" onSubmit={handleSubmit}>
                  <FormBody values={values} processing={processing} />
                  <FormSpy
                    onChange={(state) => {
                      router.remember(state.values);
                    }}
                  />
                </PiwiForm>
              );
            }}
          />
        </Section>
      </FormLayout>
      <CategoryDialog />
    </CTX.Provider>
  );
}

const FormBody = React.memo(
  ({
    values,
    processing,
  }: {
    values: NonNullable<RecipeFormProps['values']>;
    processing: boolean;
  }) => {
    const { t } = useTranslation();
    const sourceCategories = usePage().props.categories as Record<
      string,
      string
    >[];
    const categories = (() => {
      const piwi = {} as Record<string, string>;
      sourceCategories.forEach((cat) => {
        piwi[cat.id] = cat.label;
      });

      return piwi;
    })();
    const { setCategoriesDialogOpen } = useContext(CTX);
    const [fuckErrors, onChangeDecorator] = useErrors();
    const [setupVisible, setSetupVisible] = useState(
      values.preparations.length > 1,
    );

    const addCategoryClick = useCallback(
      () => setCategoriesDialogOpen(true),
      [],
    );

    return (
      <>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={3}
            container
            alignItems="center"
            justifyContent="center"
          >
            <Cover
              initial={
                values.cover ? `/storage/uploads/${values.cover}` : values.cover
              }
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Field
                  name="name"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextField
                      {...input}
                      label={t('Name')}
                      fullWidth
                      sx={{ mb: 2 }}
                      color="secondary"
                      variant="standard"
                      disabled={processing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LabelIcon />
                          </InputAdornment>
                        ),
                      }}
                      onChange={onChangeDecorator(input.onChange)}
                      error={Boolean(fuckErrors[input.name])}
                      helperText={fuckErrors[input.name]}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6} container>
                <Grid item flex={1}>
                  <Field
                    name="categories"
                    subscription={{ value: true }}
                    render={({ input }) => (
                      <FormControl
                        fullWidth
                        color="secondary"
                        disabled={processing}
                        variant="standard"
                        error={Boolean(fuckErrors[input.name])}
                      >
                        <InputLabel>{t('Categories')}</InputLabel>
                        <SelectMultiple
                          {...input}
                          onChange={onChangeDecorator(input.onChange)}
                          color="secondary"
                          options={categories as Record<string, string>}
                          error={Boolean(fuckErrors[input.name])}
                        />
                        {Boolean(fuckErrors[input.name]) && (
                          <FormHelperText error color="error">
                            {fuckErrors[input.name]}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item sx={{ pt: 1 }}>
                  <IconButton onClick={addCategoryClick}>
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            {setupVisible && (
              <Field
                name="setup"
                subscription={{ value: true }}
                render={({ input }) => (
                  <FormControl
                    fullWidth
                    error={Boolean(fuckErrors[input.name])}
                  >
                    <FormLabel sx={{ mb: 1 }}>{t('Set up')}:</FormLabel>
                    <PiwiEditor
                      initialValue={values.setup}
                      textareaName={input.name}
                      onChange={onChangeDecorator(input.onChange)}
                    />
                    {Boolean(fuckErrors[input.name]) && (
                      <FormHelperText error color="error">
                        {fuckErrors[input.name]}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            )}
          </Grid>
        </Grid>
        <Preparations>
          <FieldArray
            name="preparations"
            subscription={{ value: true }}
            render={({ fields }) => (
              <>
                {fields.map((name, index) => (
                  <Preparation
                    key={name}
                    name={name}
                    index={index}
                    onDelete={() => {
                      if (fields.length && fields.length > 1) {
                        if (fields.length - 1 <= 1) {
                          setSetupVisible(false);
                        }
                        fields.remove(index);
                      }
                    }}
                    disabled={processing}
                  />
                ))}
                <AddTable
                  label={t('Add preparation')}
                  onClick={() => {
                    setSetupVisible(true);
                    fields.push({
                      name: '',
                      ingredients: [{ name: '', weight: '' }],
                    });
                  }}
                />
              </>
            )}
          />
        </Preparations>
        <ProcessArea>
          <Field
            name="is_premium"
            subscription={{ value: true }}
            render={({ input }) => (
              <>
                <FormControlLabel
                  label={t('Premium')}
                  control={
                    <Checkbox
                      color="secondary"
                      onChange={input.onChange}
                      checked={input.value}
                    />
                  }
                />
                {input.value ? (
                  <Field
                    name="cost"
                    subscription={{ value: true }}
                    render={(piyoe) => (
                      <TextFieldCurrency
                        {...piyoe.input}
                        label={t('Cost')}
                        variant="standard"
                        sx={{ mr: 1 }}
                        color="secondary"
                        disabled={processing}
                        onChange={onChangeDecorator(piyoe.input.onChange)}
                        error={Boolean(fuckErrors[piyoe.input.name])}
                        helperText={fuckErrors[piyoe.input.name]}
                      />
                    )}
                  />
                ) : null}
              </>
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            startIcon={<MemoryIcon />}
            disabled={processing}
          >
            {t('Process')}
          </Button>
        </ProcessArea>
      </>
    );
  },
  _.isEqual,
);

const PiwiForm = styled.form(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
}));

const Preparations = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: 'auto',
  gridTemplateColumns: 'repeat(2, 1fr)',
  marginTop: theme.spacing(2),
  gap: theme.spacing(1),
  '& .MuiTableContainer-root': {
    border: `1px solid ${theme.palette.divider}`,
    '& td': {
      verticalAlign: 'bottom',
    },
  },
}));

const AddTable = styled.div<{ label: string }>(({ theme, label }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[500],
  borderColor: theme.palette.divider,
  borderStyle: 'dotted',
  cursor: 'pointer',
  ':hover': {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
  },
  ':before': {
    display: 'block',
    content: '"✙"',
    fontSize: 50,
  },
  ':after': {
    display: 'block',
    content: `"${label}"`,
    fontSize: 16,
    fontWeight: 'bold',
  },
}));

const ProcessArea = styled.div(({ theme }) => ({
  marginLeft: theme.spacing(2),
  marginTop: theme.spacing(3),
  display: 'flex',
  alignItems: 'flex-end',
  color: 'white',
}));

export interface NewPreparationCtx {
  categoriesDialogOpen: boolean;
  setCategoriesDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  values: RecipeFormProps['values'];
}

export interface RecipeFormProps {
  action: string;
  values?: Record<string, any>;
}
