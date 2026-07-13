/* eslint-disable react/no-array-index-key */
import {
  Box,
  Button,
  Card,
  Stack,
  SxProps,
  TextField,
  Typography,
} from '@mui/material';
import GenericActionButton from 'components/common/action-cell-buttons/component/generic-action-button.component';
import { ActionType } from 'constants/constants';
import { showError } from 'libs/react.toastify';
import { useTranslation } from 'react-i18next';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { TEditGoal } from '../../types';
import GoalItem from '../goal-item/goal-item.component';

const CARD: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  p: 2,
  maxHeight: '540px',
  overflow: 'auto',
};

const defaultValue = {
  id: '',
  title: '',
};

type Props = {
  goals: TEditGoal[];
  setGoals: React.Dispatch<React.SetStateAction<TEditGoal[]>>;
};

function Goals({ goals, setGoals }: Props) {
  const [isAdding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState<TEditGoal>(defaultValue);
  const { t } = useTranslation();

  const handleChangeTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNewItem((prev) => ({
        ...prev,
        title: e.target.value,
      }));
    },
    [],
  );

  const handleAddClick = useCallback(() => {
    if (newItem.title) {
      setGoals((prev) => [
        ...prev,
        { ...newItem, id: `${Math.random() * Date.now()}` },
      ]);
      setNewItem(defaultValue);
      setAdding(false);
    } else showError('Title is required');
  }, [newItem, setGoals]);

  const handleEditClick = useCallback(
    (newGoal: TEditGoal) => {
      const goalsCopy = goals;
      const index = goals.findIndex((item) => item.id === newGoal.id);
      goalsCopy[index] = newGoal;
      setGoals(goalsCopy);
    },
    [goals, setGoals],
  );

  const handleRemoveClick = useCallback(
    (removeId: string) => {
      setGoals((prev) => prev.filter((p) => p.id !== removeId));
    },
    [setGoals],
  );

  return (
    <Card sx={CARD}>
      <Typography fontWeight={600} variant="h6">
        {t('lessons.lessonGoals')}
      </Typography>
      {goals.map((goal) => (
        <GoalItem
          key={goal.id}
          goal={goal}
          handleEditClick={handleEditClick}
          handleRemoveClick={handleRemoveClick}
        />
      ))}
      {!isAdding ? (
        <Box justifyContent="center">
          <Box display="flex" justifyContent="space-between">
            <TextField
              value={newItem.title}
              onChange={handleChangeTitle}
              placeholder={t('lessons.title') || ''}
              multiline
              sx={{ width: '100%' }}
            />
            <Button
              sx={{ width: 20, mt: 1, verticalAlign: 'middle' }}
              onClick={handleAddClick}
            >
              {t('lessons.add')}
            </Button>
          </Box>
        </Box>
      ) : (
        <Stack gap={1}>
          <TextField
            value={newItem.title}
            onChange={handleChangeTitle}
            placeholder={String(t('lessons.title'))}
            multiline
          />
          <Stack>
            <GenericActionButton
              tooltip="Add Goal"
              actionType={ActionType.ADD}
              onClickActionButton={() => setAdding(true)}
            />
          </Stack>

          <Button sx={{ width: 180 }} onClick={handleAddClick}>
            Add
          </Button>
        </Stack>
      )}
    </Card>
  );
}

export default Goals;
