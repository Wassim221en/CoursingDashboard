import React, { ChangeEvent, memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  SxProps,
  TextField,
  Typography,
} from '@mui/material';
import { showError } from 'libs/react.toastify';
import ActionCellButtons from 'components/common/action-cell-buttons/action-cell-buttons.component';
import { TEditGoal } from '../../types';

const CARD: SxProps = {
  px: 2,
  py: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  flexShrink: 0,
};

type Props = {
  handleEditClick: (newItem: TEditGoal) => void;
  handleRemoveClick: (removeId: string) => void;
  goal: TEditGoal;
};

function GoalItem({ goal, handleEditClick, handleRemoveClick }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [newItem, setNewItem] = useState<TEditGoal>(goal);
  const { t } = useTranslation();
  const handleEdit = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);
  const handleSubmitEdit = useCallback(() => {
    if (newItem.title) {
      handleEditClick({
        title: newItem.title,
        id: goal.id,
      });
      handleEdit();
    } else showError('Title is required');
  }, [goal.id, handleEdit, handleEditClick, newItem.title]);

  const handleChangeTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNewItem((prev) => ({
        id: prev.id,
        title: e.target.value,
      }));
    },
    [],
  );

  return (
    <Card sx={CARD}>
      {editMode ? (
        <TextField
          value={newItem.title}
          onChange={handleChangeTitle}
          placeholder={String(t('lessons.title'))}
        />
      ) : (
        <Typography fontWeight={500}>{newItem.title}</Typography>
      )}

      <Box display="flex" justifyContent="space-between">
        {editMode && <Button onClick={handleSubmitEdit}>Submit</Button>}
        <ActionCellButtons
          data={null}
          handleEditClick={handleEdit}
          handleRemoveClick={() => handleRemoveClick(goal.id)}
          permissionName="forceAllow"
        />
      </Box>
    </Card>
  );
}

export default memo(GoalItem);
