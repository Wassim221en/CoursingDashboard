import { Box } from '@mui/material';
import GenericAutoCompleteComponent from 'hooks/use-generic-form/components/generic-auto-complete/generic-auto-complete.component';
import { getNameById } from 'hooks/use-generic-form/helpers';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import React from 'react';

type Props = {
  onChange: (data: TAutoComplete | null) => void;
  value: TAutoComplete | null;
  defaultValue: number;
  disabled?: boolean;
  isLoading?: boolean;
  options: TAutoComplete[];
  label: string;
};

function FilterAutoComplete({
  defaultValue,
  onChange,
  value,
  disabled,
  isLoading,
  options,
  label,
}: Props) {
  const defaultVal = {
    id: defaultValue,
    name: getNameById(options, String(defaultValue)),
  };

  return (
    <Box display="flex">
      <GenericAutoCompleteComponent
        isLoading={isLoading}
        label={label}
        onChange={(data) => onChange(data as TAutoComplete)}
        options={options}
        value={
          value && !value?.name
            ? {
                id: value?.id || 0,
                name: getNameById(options, String(value?.id)),
              }
            : value
        }
        defaultValue={defaultValue ? defaultVal : undefined}
        disabled={disabled}
      />
    </Box>
  );
}

export default FilterAutoComplete;
