/* eslint-disable react/jsx-props-no-spreading */
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import React, { memo, useCallback, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Control } from 'react-hook-form/dist/types';

interface FormTextFieldProps {
  name: string;
  label: string;
  multiline?: boolean;
  control: Control<any, any>;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  type?: 'number' | 'date' | 'text' | 'password' | 'tel';
  isDuration?: boolean;
  onValChange?: (val: string) => void;
  [key: string]: any;
}

function FormTextField({
  name,
  control,
  label,
  multiline = false,
  disabled = false,
  readOnly = false,
  required = false,
  type = 'text',
  addClick,
  handleAddClick,
  isDuration,
  onValChange,
  ...props
}: FormTextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handleDurationChange = useCallback(
    ({
      event,
      onChange,
    }: {
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
      onChange: (...event: any[]) => void;
      // eslint-disable-next-line consistent-return
    }) => {
      const x = /(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      if (event.target.value.length >= 5 && !x.test(event.target.value)) {
        event.target.value = '';
      }
      onChange(event);
      onValChange?.(event.target.value);
    },
    [onValChange],
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          multiline={multiline}
          rows={multiline ? 4 : 1}
          variant="outlined"
          disabled={disabled}
          fullWidth
          label={required ? `${label}*` : label}
          {...field}
          error={!!error}
          helperText={error && error.message}
          type={showPassword ? 'text' : type}
          onChange={
            isDuration
              ? (event) =>
                  handleDurationChange({
                    event,
                    onChange: field.onChange,
                  })
              : (event) => {
                  field.onChange(event);
                  onValChange?.(event.target.value);
                }
          }
          InputProps={{
            readOnly,
            endAdornment:
              type === 'password' ? (
                <InputAdornment
                  position="end"
                  sx={{ backgroundColor: 'transparent' }}
                >
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ) : undefined,
          }}
          {...props}
        />
      )}
    />
  );
}

export default memo(FormTextField);
