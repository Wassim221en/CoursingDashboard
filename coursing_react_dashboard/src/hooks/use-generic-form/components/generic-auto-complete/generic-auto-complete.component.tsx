/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/function-component-definition */
import { FC, memo } from 'react';
import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import { TAutoComplete } from './types';
import AutoCompleteInputAddButton from '../auto-completeInput-add-button/auto-completeInput-add-button.component';

const filter = createFilterOptions<TAutoComplete>();

type GenericAutoCompleteProps = {
  options: TAutoComplete[];
  isLoading?: boolean;
  label: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  onChange: (value: TAutoComplete | null) => void;
  handleAddItem?: boolean;
  freeSolo?: boolean;
  [key: string]: any;
} & (
  | {
      value: TAutoComplete | null;
      defaultValue?: TAutoComplete;
    }
  | {
      value: TAutoComplete[] | null;
      defaultValue?: TAutoComplete[];
    }
);

const GenericAutoComplete: FC<GenericAutoCompleteProps> = ({
  value,
  onChange,
  options,
  defaultValue,
  isLoading,
  label,
  required,
  isMulti,
  disabled,
  errorMessage,
  handleAddClick,
  multiple,
  hidden,
  freeSolo,
  ...props
}) => (
  <Autocomplete
    hidden={hidden}
    isOptionEqualToValue={(option, v) => option?.id === v?.id || false}
    value={value}
    onChange={async (_e, val) => {
      onChange(val as TAutoComplete);
    }}
    options={options || []}
    filterSelectedOptions
    disabled={!options?.length || disabled}
    multiple={multiple}
    freeSolo={!!freeSolo}
    sx={{ minWidth: 280 }}
    getOptionLabel={(option) =>
      typeof option === 'string' ? option : option.name
    }
    filterOptions={(_options, params) => {
      const filtered = filter(_options, params);

      const { inputValue } = params;
      // Suggest the creation of a new value
      const isExisting = options.some((option) => inputValue === option.name);

      if (inputValue !== '' && !isExisting && freeSolo) {
        filtered.push({
          id: 0,
          name: inputValue,
        });
      }

      return filtered;
    }}
    renderOption={({ key, ...prps }, option) => (
      <li key={key} {...prps}>
        {option.name}
      </li>
    )}
    {...props}
    renderInput={(params) => (
      <TextField
        {...params}
        label={isLoading ? 'Loading...' : required ? `${label}*` : label}
        error={!!errorMessage}
        helperText={errorMessage && errorMessage}
        fullWidth
        InputProps={{
          ...params.InputProps,
          endAdornment: handleAddClick ? (
            <div>
              {params.InputProps.endAdornment}
              <AutoCompleteInputAddButton onClick={() => handleAddClick()} />
            </div>
          ) : (
            params.InputProps.endAdornment
          ),
        }}
      />
    )}
  />
);

export default memo(GenericAutoComplete);
