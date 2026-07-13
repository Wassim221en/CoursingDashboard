/* eslint-disable react/jsx-props-no-spreading */
import {
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import { TRadioOption } from 'hooks/use-generic-form/types';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface FormCheckboxProps<T extends FieldValues, TName extends FieldPath<T>> {
  name: TName;
  label: string;
  control: Control<T, any>;
  options: TRadioOption[];
  onValChange?: (rad: number) => void;
}

function FormRadio<T extends FieldValues, TName extends FieldPath<T>>({
  name,
  label,
  control,
  options,
  onValChange,
}: FormCheckboxProps<T, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">{label}</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={Number(field.value)}
            onChange={(event) => {
              field.onChange(event);
              onValChange?.(Number(event.target.value));
            }}
          >
            {options.map((o) => (
              <FormControlLabel
                key={o.value}
                value={o.value}
                control={<Radio />}
                label={o.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    />
  );
}

export default FormRadio;
