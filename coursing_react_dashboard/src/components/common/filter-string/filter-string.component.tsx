import { Box, TextField } from '@mui/material';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

const FilterString = ({ query, setQuery }: Props) => {
  const handleChangeQuery = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    [setQuery],
  );

  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '280px',
        mb: 2,
        display: 'flex',
        gap: 2,
      }}
    >
      <TextField
        label={t('common.searchByName')}
        variant="outlined"
        value={query}
        sx={{
          width: '100%',
        }}
        onChange={handleChangeQuery}
      />
    </Box>
  );
};
export default FilterString;
