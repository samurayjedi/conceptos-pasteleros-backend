import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import {
  Checkbox,
  Select,
  SelectProps,
  FormHelperText,
  MenuItem,
} from '@mui/material';

export default function SelectMultiple({
  options,
  helperText = '',
  ...props
}: SelectMultipleProps) {
  const { t }: { t: (arg: string) => string } = useTranslation();
  const displayErrors = Boolean(helperText);

  return (
    <>
      <Select
        {...props}
        multiple
        renderValue={(selected) => {
          const piwiAux = selected as any as Array<string>;
          if (piwiAux.length === 0) {
            return <em />;
          }

          const piyoe = [] as Array<string>;
          piwiAux.forEach((idOrSlug) => {
            piyoe.push(options[idOrSlug]);
          });

          return <em>{piyoe.join(',')}</em>;
        }}
      >
        {_.map(options, (label, idOrSlug) => (
          <MenuItem key={`option-${idOrSlug}`} value={idOrSlug}>
            <Checkbox
              checked={props.value.indexOf(idOrSlug) > -1}
              color={props.color}
            />
            {t(label)}
          </MenuItem>
        ))}
      </Select>
      {props.error && displayErrors && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </>
  );
}

export type SelectMultipleProps = SelectProps<string[]> & {
  value: Array<string>;
  options: Record<string, string>;
  helperText?: string;
};
