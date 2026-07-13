import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import usersApis from 'apis/users/users.api';
import FadeModal from 'components/common/generic-table-page/components/fade-modal/fade-modal.component';
import { showError, showSuccess } from 'libs/react.toastify';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Instructor / user id to set password for (dashboard admin flow). */
  targetUserId: number | null;
};

function InstructorChangePasswordModal({
  open,
  setOpen,
  targetUserId,
}: Props) {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetFields = useCallback(() => {
    setNewPassword('');
    setConfirmPassword('');
  }, []);

  useEffect(() => {
    if (!open) {
      resetFields();
    }
  }, [open, resetFields]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (targetUserId == null || targetUserId <= 0) {
      showError(t('common.somethingWentWrong'));
      return;
    }
    if (newPassword.length < 6) {
      showError(t('instructors.newPasswordMinLength'));
      return;
    }
    if (newPassword !== confirmPassword) {
      showError(t('instructors.passwordMismatch'));
      return;
    }
    setSubmitting(true);
    try {
      await usersApis.setUserPassword({
        userId: targetUserId,
        newPassword: newPassword.trim(),
      });
      resetFields();
      setOpen(false);
      showSuccess(t('instructors.passwordChangedSuccess'));
    } catch (err: unknown) {
      let msg = t('common.somethingWentWrong');
      if (axios.isAxiosError(err) && err.response?.data != null) {
        const d = err.response.data;
        msg = typeof d === 'string' ? d : JSON.stringify(d);
      }
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FadeModal
      width={480}
      open={open}
      setOpen={setOpen}
      modalTitle={String(t('instructors.changePasswordTitle'))}
      onClose={resetFields}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('instructors.changePasswordDescriptionAdmin')}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="password"
          margin="normal"
          label={t('instructors.newPassword')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />
        <TextField
          fullWidth
          type="password"
          margin="normal"
          label={t('instructors.confirmNewPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          disabled={submitting}
        >
          {t('common.save')}
        </Button>
      </Box>
    </FadeModal>
  );
}

export default InstructorChangePasswordModal;
