import { Box, TextField } from '@mui/material';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

type Props = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

const SideBarFilter = ({ query, setQuery }: Props) => {
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
        width: '90%',
        py: 1,
        m: 'auto',
      }}
    >
      {/* <TextField
        label={t('common.fastSearch')}
        value={query}
        variant="outlined"
        size="small"
        inputProps={{
          style: {
            height: '15px',
          },
        }}
        onChange={handleChangeQuery}
      /> */}

      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <ManageSearchIcon sx={{ color: 'action.active', mx: 1, my: 0.5 }} />
        <TextField
          value={query}
          label={t('common.fastSearch')}
          variant="standard"
          onChange={handleChangeQuery}
        />
      </Box>
    </Box>
  );
};
export default SideBarFilter;
