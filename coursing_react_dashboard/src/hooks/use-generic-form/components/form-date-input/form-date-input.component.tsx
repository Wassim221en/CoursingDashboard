/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, memo } from 'react';
import { Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Control } from 'react-hook-form/dist/types';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { DesktopDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface IFormDateInputProps {
  isTime?: boolean;
  isDuration?: boolean;
  isDateAndTime?: boolean;
  name: string;
  label: string;
  control: Control<any, any>;
  disabled?: boolean;
  required?: boolean;
  maxDate?: Date;
  minDate?: Date;
  inputFormat?: string;
  ampm?: boolean;
  [key: string]: any;
}

const FormDateInput: FC<IFormDateInputProps> = ({
  isTime = false,
  isDateAndTime = false,
  name,
  control,
  label,
  disabled = false,
  required = false,
  isDuration = false,
  maxDate,
  minDate,
  ampm = true,
  inputFormat = undefined,
  ...props
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {isTime ? (
          <TimePicker
            label={label}
            value={field.value ? dayjs(field.value) : undefined}
            onChange={field.onChange}
            ampm={ampm}
            sx={{ width: '100%' }}
            views={inputFormat ? ['hours', 'minutes', 'seconds'] : undefined}
            disabled={disabled}
            {...props}
          />
        ) : isDateAndTime ? (
          <DesktopDateTimePicker
            label={label}
            value={field.value ? dayjs(field.value) : undefined}
            maxDate={maxDate ? dayjs(maxDate) : undefined}
            minDate={minDate ? dayjs(minDate) : undefined}
            onChange={field.onChange}
            sx={{ width: '100%' }}
            {...props}
          />
        ) : (
          <DesktopDatePicker
            label={label}
            value={field.value ? dayjs(field.value) : undefined}
            maxDate={maxDate ? dayjs(maxDate) : undefined}
            minDate={minDate ? dayjs(minDate) : undefined}
            onChange={field.onChange}
            views={['day', 'month', 'year']}
            sx={{ width: '100%' }}
            {...props}
          />
        )}
      </LocalizationProvider>
    )}
  />
);

export default memo(FormDateInput);
