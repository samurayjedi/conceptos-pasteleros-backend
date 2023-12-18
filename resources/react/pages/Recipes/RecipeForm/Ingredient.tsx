import { useContext } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field, useForm } from 'react-final-form';
import {
  IconButton,
  TextField,
  InputAdornment,
  TableRow,
  TableRowProps,
  TableCell,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { CTX_PREPARATION, PiwiPreparation } from './Preparation';
import { useErrors } from '../../../src/hooks';
import { pathToLaravelPath } from '../../../lib/miscUtils';
import TextFieldMasked from '../../../piwi/core/TextFieldMasked';

export default function Ingredient({
  name,
  index,
  onDelete,
  ...props
}: IngredientProps) {
  const ctx = useContext(CTX_PREPARATION);
  const { t } = useTranslation();
  const form = useForm();
  const [fuckErrors, onChangeDecorator] = useErrors();

  return (
    <TableRow {...props}>
      <TableCell>
        <Field
          name={`${name}.name`}
          subscription={{ value: true }}
          render={({ input }) => (
            <TextField
              {...input}
              label={t('Name')}
              fullWidth
              color="secondary"
              disabled={ctx?.disabled}
              variant="standard"
              onChange={onChangeDecorator(input.onChange)}
              error={Boolean(fuckErrors[pathToLaravelPath(input.name)])}
              helperText={fuckErrors[pathToLaravelPath(input.name)]}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Field
          name={`${name}.weight`}
          subscription={{ value: true }}
          render={({ input }) => (
            <TextFieldMasked
              {...input}
              mask="#########"
              definitions={{
                '#': /[0-9]/,
              }}
              fullWidth
              color="secondary"
              disabled={ctx?.disabled}
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">gr</InputAdornment>
                ),
              }}
              onChange={onChangeDecorator(input.onChange)}
              error={Boolean(fuckErrors[pathToLaravelPath(input.name)])}
              helperText={fuckErrors[pathToLaravelPath(input.name)]}
            />
          )}
        />
      </TableCell>
      <TableCell align="center">
        {(() => {
          const recipe: PiwiPreparation = _.get(
            form.getState(),
            `values.preparations[${ctx?.index}]`,
            {},
          );
          const thisIngredient = recipe.ingredients[index];
          const thisWeight =
            thisIngredient.weight && thisIngredient.weight.length
              ? parseInt(thisIngredient.weight, 10)
              : 0;
          let totalWeight = 0;
          recipe.ingredients.forEach((ingredient) => {
            const { weight } = ingredient;
            if (weight && weight.length) {
              totalWeight += parseInt(ingredient.weight, 10);
            }
          });

          if (!thisWeight && !totalWeight) {
            return '0%';
          }

          return `${((thisWeight / totalWeight) * 100).toFixed(2)}%`;
        })()}
      </TableCell>
      <TableCell>
        <IconButton size="small" onClick={onDelete}>
          <DeleteForeverIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export interface IngredientProps extends TableRowProps {
  name: string;
  index: number;
  onDelete: () => void;
}
