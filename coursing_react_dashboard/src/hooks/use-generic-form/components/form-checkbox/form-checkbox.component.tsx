/* eslint-disable react/jsx-props-no-spreading */
import {
  FormControlLabel,
  Checkbox,
  SxProps,
  FormHelperText,
  Box,
} from '@mui/material';
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';

interface FormCheckboxProps<T extends FieldValues, TName extends FieldPath<T>> {
  name: TName;
  label: string;
  control: Control<T, any>;
  labelPlacement?: 'start' | 'end' | 'bottom' | 'top';
  defaultChecked?: boolean;
  sx?: SxProps | null;
  onValChange?: (bool: boolean) => void;
  [key: string]: any;
}

function FormCheckbox<T extends FieldValues, TName extends FieldPath<T>>({
  name,
  label,
  control,
  labelPlacement = 'end',
  defaultChecked,
  sx = null,
  onValChange,
}: FormCheckboxProps<T, TName>) {
  const {
    field: { value, onChange },
    formState: { isSubmitting },
    fieldState: { error },
  } = useController({ name, control });
  return (
    <Box sx={sx} mt={1}>
      <FormControlLabel
        disabled={isSubmitting}
        control={
          <Checkbox
            defaultChecked={defaultChecked}
            checked={value}
            onChange={(e, v) => {
              onChange(v);
              onValChange?.(v);
            }}
          />
        }
        label={label}
        labelPlacement={labelPlacement}
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </Box>
  );
}
export default FormCheckbox;
