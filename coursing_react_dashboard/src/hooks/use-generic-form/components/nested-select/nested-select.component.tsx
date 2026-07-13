import { Box, Typography } from '@mui/material';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import { TNestedItem } from 'hooks/use-generic-form/types';
import React, { memo } from 'react';
import ThemeVariables from 'theme/theme-variables';
import { useTranslation } from 'react-i18next';
import NestedList from './components/nested-list/nested-list.component';

type Props = {
  items: TNestedItem[];
  isLoading: boolean;
  label?: string;
  onChange: (id: number | null) => void;
  value: number;
  errorMessage?: string;
  disabled?: boolean;
};

function NestedSelect({
  items,
  isLoading,
  label,
  onChange,
  value,
  errorMessage,
  disabled,
}: Props) {
  const { t } = useTranslation();
  return (
    <div>
      <Typography color="gray">
        {label ?? t('common.nested-select-message')}
      </Typography>
      <Box
        sx={{
          overflowY: 'auto',
          height: '200px',
          border: `solid 1px ${
            errorMessage ? ThemeVariables.ERROR_COLOR : 'rgba(0,0,0,0.3)'
          }`,
          padding: 1,
          marginTop: 2,
        }}
      >
        {items.length === 0 && (
          <Typography gutterBottom color="gray">
            No items to show
          </Typography>
        )}
        {isLoading && <LoadingPlaceholder />}
        {items.map((item) => (
          <NestedList
            key={item.id}
            checkedValue={value}
            onCheck={onChange}
            item={item}
            disabled={disabled}
          />
        ))}
      </Box>
      <Typography variant="caption" color="error" ml={1} mt={1}>
        {errorMessage && errorMessage}
      </Typography>
    </div>
  );
}

export default memo(NestedSelect);
