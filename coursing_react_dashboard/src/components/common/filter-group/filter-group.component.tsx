/* eslint-disable react/no-array-index-key */
import { Grid } from '@mui/material';
import GenericAutoCompleteComponent from 'hooks/use-generic-form/components/generic-auto-complete/generic-auto-complete.component';
import { getNameById } from 'hooks/use-generic-form/helpers';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type TFilter = {
  label: string;
  options: TAutoComplete[];
  value: TAutoComplete | null;
  setValue: React.Dispatch<React.SetStateAction<TAutoComplete | null>>;
  disabled?: boolean;
  isLoading: boolean;
  defaultValue?: number;
};

function FilterGroup({ filterArr }: { filterArr: TFilter[] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangeData = useCallback(
    ({
      data,
      setValue,
      label,
    }: {
      data: TAutoComplete | null;
      setValue: React.Dispatch<React.SetStateAction<TAutoComplete | null>>;
      label: string;
    }) => {
      const search = searchParams;
      search[label] = data?.id;
      setSearchParams(search);
      setValue(data);
    },
    [searchParams, setSearchParams],
  );

  return (
    <Grid container spacing={2} width="100%">
      {filterArr?.map(
        (
          {
            label,
            options,
            value,
            setValue,
            disabled,
            isLoading,
            defaultValue,
          },
          index,
        ) => (
          <Grid item xs={12} sm={4} key={index + label}>
            <GenericAutoCompleteComponent
              isLoading={isLoading}
              label={label}
              onChange={(data) =>
                handleChangeData({
                  data: data as TAutoComplete,
                  label,
                  setValue,
                })
              }
              options={options}
              value={
                value && !value?.name
                  ? {
                    id: value?.id || 0,
                    name: getNameById(options, String(value?.id)),
                  }
                  : value
              }
              defaultValue={
                defaultValue
                  ? {
                    id: defaultValue,
                    name: getNameById(options, String(defaultValue)),
                  }
                  : undefined
              }
              disabled={disabled}
            />
          </Grid>
        ),
      )}
    </Grid>
  );
}

export default FilterGroup;
