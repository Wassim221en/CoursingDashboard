/* eslint-disable react/jsx-props-no-spreading */
import { TextField, TextFieldProps } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  label: string;
  maxDate?: Date | null;
  minDate?: Date | null;
  value: Date | null;
  setValue: Dispatch<SetStateAction<Date | null | undefined>>;
  disabled?: boolean;
};

function DateFilter({
  label,
  maxDate,
  minDate,
  value,
  setValue,
  disabled,
}: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        disabled={disabled}
        label={label}
        maxDate={maxDate}
        minDate={minDate}
        // inputFormat="dd/MM/yyyy"
        value={value || null}
        onChange={(val) => setValue(val!)}
        // renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
        //   <TextField
        //     disabled={disabled}
        //     fullWidth
        //     // label={required ? `${label} *` : label}
        //     {...params}
        //   />
        // )}
      />
    </LocalizationProvider>
  );
}

export default DateFilter;
