import { Add, Check, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  FormControlLabel,
  IconButton,
  Switch,
  SxProps,
  TextField,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import courseApi from 'apis/course/course.api';
import { ICourseQuestion } from 'apis/course/course.interfaces';
import { IWebContentEnName } from 'apis/permissions/permissions.interfaces';
import ActionCellButtons from 'components/common/action-cell-buttons/action-cell-buttons.component';
import DeleteDialog from 'components/common/generic-table-page/components/delete-diaolg/delete-diaolg.component';
import { showSuccess } from 'libs/react.toastify';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sanitizeHtml } from 'utils/helpers';
import { useCRUDState } from '@craft-code/react-helper-utils/hooks';
import { Stack } from '@mui/system';
import ThemeVariables from 'theme/theme-variables';

const ITEM: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  gap: 1,
};

type Props = {
  item: ICourseQuestion;
  handleRemoveClick: (id: number) => void;
  handleEditQuestionClick: (question: string, id: number) => void;
  permissionName: IWebContentEnName;
};

function CollapseQuestionItem({
  item,
  handleRemoveClick,
  handleEditQuestionClick: handleEditClick,
  permissionName,
}: Props) {
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);
  const [answerTxt, setAnswerTxt] = useState<string>();
  const [questionTxt, setQuestionTxt] = useState<string>();
  const { dispatch, is, state } = useCRUDState<{
    answer?: string;
    answerId?: number;
    question?: string;
    questionId?: number;
  }>();
  const [processing, setProcessing] = useState(false);
  const [openDeleteAnswerModal, setOpenDeleteAnswerModal] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const queryClient = useQueryClient();
  const refetch = useCallback(
    () => queryClient.refetchQueries(['get-all-course-questions-and-answers']),
    [queryClient],
  );

  const handleRemoveQuestionAnswer = async (id) => {
    try {
      await courseApi.removeCourseQuestionAnswer(id);
      await refetch();
      showSuccess(t('common.dataDeletedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  const handleToggleQuestionVisibility = async () => {
    setProcessing(true);
    try {
      await courseApi.updateCourseQuestionState(item.id, !item.isHidden);
      await refetch();
      showSuccess(t('courses.question-status-change-success'));
    } catch (error) {
      console.error(error);
      showSuccess(t('courses.question-status-change-failed'));
    }
    setProcessing(false);
  };
  const handleAnswerAction = async ({
    answerId,
    answer,
    questionId,
  }: {
    answerId?: number;
    answer: string;
    questionId: number;
  }) => {
    setProcessing(true);
    try {
      if (!answerId) {
        await courseApi.addCourseQuestionAnswer({ answer, questionId });
      } else {
        await courseApi.updateCourseQuestionAnswer({
          id: answerId,
          answer,
          questionId,
        });
      }
      await refetch();
    } catch (error) {
      console.error(error);
    }
    dispatch.RESET();
    setAnswerTxt(undefined);
    setProcessing(false);
  };

  const isRead = item.isReadFromDashboard;

  return (
    <Accordion
      sx={{
        width: '100%',
        fontSize: 30,
        backgroundColor: !isRead ? '#f5f5f5' : '#fff',
      }}
      variant={!isRead ? 'outlined' : 'elevation'}
      expanded={expanded}
    >
      <AccordionSummary onClick={handleExpandClick}>
        <Box sx={ITEM}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ opacity: 0.6 }}>
              {sanitizeHtml(item.user.name)}{' '}
              {item.lesson?.title ? (
                <>
                  ({t('from-lesson')}
                  {' : '}
                  {item.lesson.title})
                </>
              ) : (
                ''
              )}
            </Typography>
            {is.EDITING ? (
              <TextField
                value={questionTxt}
                onClick={(e) => e.stopPropagation()}
                onChange={({ target }) => {
                  setQuestionTxt(target.value);
                  dispatch.EDIT({
                    question: target.value,
                    questionId: item.id,
                  });
                }}
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      disabled={item.question === questionTxt}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(questionTxt ?? item.question, item.id);
                      }}
                      size="small"
                      color="success"
                    >
                      <Check />
                    </IconButton>
                  ),
                }}
              />
            ) : (
              <Typography
                fontWeight="bold"
                sx={{
                  color: !isRead ? ThemeVariables.PRIMARY_COLOR : undefined,
                }}
              >
                {sanitizeHtml(item.question)}
              </Typography>
            )}
          </Box>
          <FormControlLabel
            sx={{ flexShrink: 0 }}
            disabled={processing}
            onClick={(e) => e.stopPropagation()}
            control={
              <Switch
                checked={!item.isHidden}
                onClick={handleToggleQuestionVisibility}
              />
            }
            label={t('courses.show-question-in-app')}
          />
          <ActionCellButtons
            data={null}
            handleRemoveClick={(_, e) => {
              e.stopPropagation();
              handleRemoveClick(item.id);
            }}
            permissionName={permissionName}
          />
          <ActionCellButtons
            data={null}
            // handleEditClick={() => handleEditClick(item.question, item.id)}
            handleEditClick={(_, e) => {
              e.stopPropagation();

              if (is.EDITING) dispatch.RESET();
              else {
                setQuestionTxt(item.question);
                dispatch.EDIT({
                  questionId: item.id,
                  question: item.question,
                });
              }
            }}
            permissionName={permissionName}
          />
          <IconButton
            onClick={handleExpandClick}
            sx={{
              transform: !expanded ? 'rotate(-90deg)' : 'rotate(0deg)',
              transition: '0.2s',
              pt: 1.4,
            }}
          >
            <ExpandMore sx={{ color: '#000a' }} />
          </IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
      >
        {item.answers.map((answer) => (
          <Card
            variant="outlined"
            key={answer.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 2,
            }}
          >
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Typography>{sanitizeHtml(answer.user.name)}</Typography>
              {state?.answerId === answer.id ? (
                <TextField
                  value={answerTxt}
                  onChange={({ target }) => {
                    setAnswerTxt(target.value);
                    dispatch.EDIT({
                      answer: target.value,
                      answerId: answer.id,
                    });
                  }}
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        disabled={!answerTxt}
                        onClick={() =>
                          handleAnswerAction({
                            answerId: answer.id,
                            answer: answerTxt ?? '',
                            questionId: item.id,
                          })
                        }
                        size="small"
                        color="success"
                      >
                        <Check />
                      </IconButton>
                    ),
                  }}
                />
              ) : (
                <Typography fontWeight={600}>
                  {sanitizeHtml(answer.answer)}
                </Typography>
              )}
            </Stack>
            <Box>
              <ActionCellButtons
                data={null}
                handleRemoveClick={() => setOpenDeleteAnswerModal(true)}
                permissionName={permissionName}
              />
              <ActionCellButtons
                data={null}
                handleEditClick={() => {
                  if (is.EDITING) dispatch.RESET();
                  else {
                    setAnswerTxt(sanitizeHtml(answer.answer));
                    dispatch.EDIT({
                      answerId: answer.id,
                      answer: answer.answer,
                    });
                  }
                }}
                permissionName={permissionName}
              />
            </Box>
            <DeleteDialog
              open={openDeleteAnswerModal}
              setOpen={setOpenDeleteAnswerModal}
              ButtonAcceptClick={() => handleRemoveQuestionAnswer(answer.id)}
            />
          </Card>
        ))}
        <TextField
          disabled={is.EDITING}
          fullWidth
          value={is.ADDING ? answerTxt : ''}
          size="small"
          onChange={({ target }) => {
            dispatch.ADD({ answer: target.value });
            setAnswerTxt(target.value);
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                disabled={!state?.answer || is.EDITING}
                onClick={() =>
                  handleAnswerAction({
                    answer: answerTxt ?? '',
                    questionId: item.id,
                  })
                }
                size="small"
                color="primary"
              >
                <Add />
              </IconButton>
            ),
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
}

export default CollapseQuestionItem;
