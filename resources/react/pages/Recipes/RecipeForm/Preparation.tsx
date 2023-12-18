import React, { DetailedHTMLProps, HTMLAttributes, useContext } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  FormControl,
  FormLabel,
  Button,
  IconButton,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormHelperText,
} from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ClearIcon from '@mui/icons-material/Clear';
import Ingredient from './Ingredient';
import PiwiEditor from './PiwiEditor';
import { pathToLaravelPath } from '../../../lib/miscUtils';
import { useErrors } from '../../../src/hooks';
import { CTX } from '.';

export const CTX_PREPARATION = React.createContext<PreparationProps | null>(
  null,
);

export default function Preparation(piwi: PreparationProps) {
  const { name, disabled, onDelete, index, ...props } = piwi;
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const { values } = useContext(CTX);

  return (
    <CTX_PREPARATION.Provider value={piwi}>
      <Item {...props}>
        <ItemHeader>
          <Field
            name={`${name}.name`}
            subscription={{ value: true }}
            render={({ input }) => (
              <TextField
                {...input}
                label={t('Preparation name')}
                fullWidth
                color="secondary"
                disabled={disabled}
                variant="standard"
                onChange={onChangeDecorator(input.onChange)}
                error={Boolean(fuckErrors[pathToLaravelPath(input.name)])}
                helperText={fuckErrors[pathToLaravelPath(input.name)]}
              />
            )}
          />
          <IconButton onClick={onDelete}>
            <ClearIcon />
          </IconButton>
        </ItemHeader>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Ingredients')}:</TableCell>
                <TableCell>{t('Weight')}:</TableCell>
                <TableCell>{t('Percentage')}:</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <FieldArray
                name={`${name}.ingredients`}
                subscription={{ value: true }}
                render={({ fields }) => {
                  let totalWeight = 0;
                  let totalPercentaje = 0;
                  fields.value.forEach((item) => {
                    const weight = parseInt(item.weight, 10);
                    // eslint-disable-next-line no-restricted-globals
                    if (!isNaN(weight)) {
                      totalWeight += weight;
                    }
                  });
                  fields.value.forEach((item) => {
                    const weight = parseInt(item.weight, 10);
                    // eslint-disable-next-line no-restricted-globals
                    if (!isNaN(weight)) {
                      totalPercentaje += (weight / totalWeight) * 100;
                    }
                  });

                  return (
                    <>
                      {fields.map((piwiName, piwiIndex) => (
                        <Ingredient
                          key={piwiName}
                          name={piwiName}
                          index={piwiIndex}
                          onDelete={() => {
                            if (fields.length && fields.length > 1) {
                              fields.remove(piwiIndex);
                            }
                          }}
                        />
                      ))}
                      <TableRow>
                        <TableCell>{t('Total')}:</TableCell>
                        <TableCell align="center">{totalWeight} gr</TableCell>
                        <TableCell align="center">
                          {totalPercentaje.toFixed(2)}%
                        </TableCell>
                        <TableCell />
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="center" valign="middle">
                          <Button
                            variant="text"
                            size="small"
                            color="secondary"
                            startIcon={<PlaylistAddIcon />}
                            onClick={() =>
                              fields.push({
                                name: '',
                                weight: '',
                              })
                            }
                          >
                            {t('Add Ingredient')}
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Field
                            name={`${name}.instructions`}
                            subscription={{ value: true }}
                            render={({ input }) => (
                              <FormControl
                                fullWidth
                                error={Boolean(
                                  fuckErrors[pathToLaravelPath(input.name)],
                                )}
                              >
                                <FormLabel sx={{ mb: 1 }}>
                                  {t('Instructions')}:
                                </FormLabel>
                                <PiwiEditor
                                  initialValue={_.get(
                                    values,
                                    `preparations[${index}].instructions`,
                                    '',
                                  )}
                                  textareaName={input.name}
                                  onChange={onChangeDecorator(input.onChange)}
                                />
                                {Boolean(
                                  fuckErrors[pathToLaravelPath(input.name)],
                                ) && (
                                  <FormHelperText error color="error">
                                    {fuckErrors[pathToLaravelPath(input.name)]}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    </>
                  );
                }}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Item>
    </CTX_PREPARATION.Provider>
  );
}

const Item = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const ItemHeader = styled.div({
  display: 'flex',
});

interface PreparationProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  name: string;
  index: number;
  onDelete: () => void;
  disabled: boolean;
}

export interface PiwiPreparation {
  name: string;
  ingredients: PiwiIngredient[];
  instructions: string;
}

export interface PiwiIngredient {
  name: string;
  weight: string;
}
