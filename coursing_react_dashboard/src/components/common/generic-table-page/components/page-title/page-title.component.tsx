import { Add, ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Stack,
  SxProps,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ThemeVariables from 'theme/theme-variables';

const CONTAINER: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  my: 2,
  gap: 1,
  alignItems: 'center',
};

const BUTTON: SxProps = {
  display: 'flex',
  alignItems: 'center',
};

const TITLE: SxProps = {
  pl: 2,
  borderLeft: `4px solid ${ThemeVariables.PRIMARY_COLOR}`,
  flexGrow: 1,
};

type Props = {
  title: string;
  handleAddClick?: () => void;
  addButtonText?: string;
  extra?: React.ReactNode;
  canAction?: boolean;
  extraButtons?: React.ReactNode;
};

function PageTitle({
  title,
  handleAddClick,
  addButtonText = 'Add',
  extra,
  canAction,
  extraButtons,
}: Props) {
  const { search } = useLocation();
  const [showExtra, setShowExtra] = useState(search !== '');
  const { t } = useTranslation();
  return (
    <>
      <Box sx={CONTAINER}>
        <Typography variant="h5" sx={TITLE}>
          {title}
        </Typography>
        {extraButtons}
        {handleAddClick && canAction && (
          <Button onClick={handleAddClick} sx={BUTTON} variant="outlined">
            {addButtonText}
            <Add />
          </Button>
        )}
      </Box>
      {extra && (
        <Box>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            gap={2}
            onClick={() => setShowExtra((prev) => !prev)}
            sx={{ cursor: 'pointer' }}
          >
            <Typography> {t('flters.filter')}</Typography>
            <IconButton>
              {showExtra ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>
          {showExtra && <Divider />}
          <Collapse in={showExtra} timeout="auto">
            <Box sx={{ mt: 1, p: 2 }}>{extra}</Box>
          </Collapse>
        </Box>
      )}
    </>
  );
}

export default PageTitle;
