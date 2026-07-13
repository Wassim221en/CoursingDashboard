import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { useAppDispatch } from 'redux/hooks';
import { authActions } from 'redux/slices/auth/auth.slice';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from 'components/common/generic-table-page/components/delete-diaolg/delete-diaolg.component';
import { useTranslation } from 'react-i18next';

const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate('/', { replace: true });
  };

  return (
    <Box>
      <IconButton onClick={() => setOpen(true)}>
        <Logout sx={{ color: '#fff' }}>Logout</Logout>
      </IconButton>
      <DeleteDialog
        customTitle={t('common.are-you-sure-logout').toString()}
        open={open}
        setOpen={setOpen}
        ButtonAcceptClick={handleLogout}
      />
    </Box>
  );
};

export default LogoutButton;
