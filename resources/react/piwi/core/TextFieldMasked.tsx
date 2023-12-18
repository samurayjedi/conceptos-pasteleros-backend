import React from 'react';
import _ from 'lodash';
import { ReactElement } from 'react-imask/dist/mixin.d';
import { IMaskInput } from 'react-imask';
import TextField, { TextFieldProps } from '@mui/material/TextField';

export default function TextFieldMasked({
  mask,
  definitions,
  InputProps,
  ...rest
}: TextFieldMaskedProps) {
  const muiInputProps = _.defaultTo(InputProps, {});
  const inputProps = _.defaultTo(muiInputProps.inputProps, {});

  return (
    <TextField
      {...rest}
      InputProps={{
        ...muiInputProps,
        inputComponent: MaskedZipInput as any,
        inputProps: {
          ...inputProps,
          mask,
          definitions,
        },
      }}
    />
  );
}

const MaskedZipInput = React.forwardRef<ReactElement, MaskInputProps>(
  (props, ref) => {
    const { onChange, ...rest } = props;
    return (
      <IMaskInput
        {...rest}
        inputRef={ref as React.RefCallback<ReactElement>}
        onAccept={(value) => {
          if (onChange) {
            onChange({ target: { name: props.name, value } });
          }
        }}
        overwrite
      />
    );
  },
);

export interface MaskInputProps {
  name: string;
  onChange?: (ev: { target: { name: string; value: unknown } }) => void;
  mask: string;
  definitions: Record<string, RegExp>;
}

export type TextFieldMaskedProps = TextFieldProps & {
  mask: string;
  definitions: Record<string, RegExp>;
};
