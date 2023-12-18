import { useCallback, useContext, useRef } from 'react';
import { router } from '@inertiajs/react';
import route from 'ziggy-js';
import { useTranslation } from 'react-i18next';
import { Form, Field } from 'react-final-form';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import { CTX } from '.';
import { useErrors } from '../../../src/hooks';

export default function CategoryDialog() {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const { categoriesDialogOpen, setCategoriesDialogOpen } = useContext(CTX);
  const formRef = useRef<HTMLFormElement>(null);

  const onSave = useCallback(() => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);

      router.post(route('categories.store'), formData, {
        onSuccess: () => setCategoriesDialogOpen(false),
      });
    }
  }, []);

  const close = useCallback(() => setCategoriesDialogOpen(false), []);

  return (
    <Dialog
      open={categoriesDialogOpen}
      maxWidth="md"
      sx={{ backgroundColor: 'transparent' }}
    >
      <DialogTitle>{t('Add new category')}</DialogTitle>
      <DialogContent>
        <Form
          subscription={{ submitting: true, pristine: true }}
          onSubmit={() => {
            //
          }}
          render={({ /** pristine, */ submitting, handleSubmit }) => {
            const processing = submitting; // && pristine

            return (
              <form ref={formRef} onSubmit={handleSubmit}>
                <Field
                  name="label"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextField
                      {...input}
                      label={t('Label')}
                      fullWidth
                      sx={{ mb: 2 }}
                      color="secondary"
                      variant="standard"
                      disabled={processing}
                      onChange={onChangeDecorator(input.onChange)}
                      error={Boolean(fuckErrors[input.name])}
                      helperText={fuckErrors[input.name]}
                    />
                  )}
                />
                <Field
                  name="slug"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextField
                      {...input}
                      label={t('Slug')}
                      fullWidth
                      sx={{ mb: 2 }}
                      color="secondary"
                      variant="standard"
                      disabled={processing}
                      onChange={onChangeDecorator(input.onChange)}
                      error={Boolean(fuckErrors[input.name])}
                      helperText={fuckErrors[input.name]}
                    />
                  )}
                />
              </form>
            );
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={close}>
          {t('Cancel')}
        </Button>
        <Button color="secondary" onClick={onSave}>
          {t('Add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
