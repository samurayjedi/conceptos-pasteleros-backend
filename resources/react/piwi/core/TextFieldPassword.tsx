import { useState } from 'react';
import {
  InputAdornment,
  IconButton,
  TextFieldProps,
  TextField,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function TextFieldPassword(props: TextFieldProps) {
  const { InputProps, ...rest } = props;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      {...rest}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              onMouseDown={(ev) => {
                ev.preventDefault();
              }}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
