/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
import { showError, showSuccess } from 'libs/react.toastify';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import PageContainer from 'components/common/page-container/page-container.component';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import NoData from 'components/common/no-data/no-data.component';
import { useTranslation } from 'react-i18next';
import courseQueries from 'apis/course/course.queries';
import CollapseQuestionList from 'components/common/collapse-question/collapse-question-list.component';
import { ICourseQuestion } from 'apis/course/course.interfaces';
import courseApi from 'apis/course/course.api';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { Box, Button } from '@mui/material';
import CourseQuestionAction from './course-question-action.component/course-question-action.component';

function CourseQuestionAndAnswers() {
  const {
    dispatchDeleting,
    dispatchResetCrudState,
    isAdding,
    isDeleting,
    getActionId,
    dispatchAdding,
    isEditing,
    getSelectedData,
  } = useCreateCrudState<ICourseQuestion>();

  const { t } = useTranslation();

  const courseId = useSearchParams('course');

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 1000,
  });

  const {
    data: courseQuestions,
    refetch,
    isLoading: isLoadingCourseQuestion,
  } = courseQueries.useCourseQuestionsAndAnswersQuery({
    courseId: Number(courseId),
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
    fromDashboard: false,
  });

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting(id);
    },
    [dispatchDeleting],
  );

  const handleRemoveQuestion = async () => {
    try {
      await courseApi.removeCourseQuestion(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataDeletedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleQuestionOrderUpdate = useCallback(
    async (
      questionsOrder: {
        question: ICourseQuestion;
        orderOffset: number;
      }[],
    ) => {
      try {
        await Promise.all(
          questionsOrder.map(({ question, orderOffset }) =>
            courseApi.updateCourseQuestionOrder(
              question.id,
              Math.max(0, question.order + orderOffset),
            ),
          ),
        );
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } catch (error) {
        console.error(error);
        showError(t('coomon.somethingWentWrong'));
      }
      refetch();
    },
    [refetch, t],
  );
  const handleActionQuestion = useCallback(
    async (question: string) => {
      try {
        await courseApi.addQA({ courseId, question });
        showSuccess(t('common.dataAddedSuccessfully'));
        dispatchResetCrudState();
      } catch (error) {
        console.error(error);
        showError(t('coomon.somethingWentWrong'));
      }
    },
    [courseId, dispatchResetCrudState, t],
  );
  const handleEditClick = useCallback(
    async (question: string, id: number) => {
      try {
        await courseApi.updateAQ({ courseId, question, id });
        showSuccess(t('common.dataUpdatedSuccessfully'));
        dispatchResetCrudState();
      } catch (error) {
        console.error(error);
        showError(t('coomon.somethingWentWrong'));
      }
    },
    [courseId, dispatchResetCrudState, t],
  );
  const handleMarkAllAsRead = useCallback(() => {
    try {
      courseApi.setAllCourseQuestionsAsRead(Number(courseId));
      showSuccess(t('common.dataUpdatedSuccessfully'));
    } catch (error) {
      console.error(error);
      showError(t('common.somethingWentWrong'));
    }
  }, [courseId, t]);

  return (
    <PageContainer
      title={String(t('courses.questionsAndAnswers'))}
      name={String(t('courses.questionsAndAnswers'))}
      actionModalTitle={
        isEditing
          ? String(t('questionsBank.answers'))
          : String(t('faqs.addFaq'))
      }
      handleDeleteSubmit={handleRemoveQuestion}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      permissionName="forceAllow"
      handleAddClick={dispatchAdding}
      extraButtons={
        <Button onClick={handleMarkAllAsRead}>
          {t('common.markAllAsRead')}
        </Button>
      }
      form={
        <CourseQuestionAction
          editItem={getSelectedData()}
          onSubmit={(data) => handleActionQuestion(data.data.title)}
        />
      }
    >
      {isLoadingCourseQuestion && <LoadingPlaceholder />}
      {!courseQuestions?.data.length && <NoData />}
      <Box>
        <CollapseQuestionList
          items={
            courseQuestions?.data.map((item, idx) => {
              // to preserve refrence equality
              (item as any).idx = idx;
              return item as ICourseQuestion & { idx: number };
            }) || []
          }
          handleEditClick={(question, id) => handleEditClick(question, id)}
          handleRemoveClick={handleRemoveClick}
          handleOrderChange={handleQuestionOrderUpdate}
          permissionName="forceAllow"
        />
      </Box>
    </PageContainer>
  );
}

export default CourseQuestionAndAnswers;
