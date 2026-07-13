import examApi from 'apis/exam/exam.api';
import { IQuestion } from 'apis/exam/exam.interfaces';
import examQueries from 'apis/exam/exam.queries';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { showSuccess } from 'libs/react.toastify';
import { MRT_ColumnDef } from 'material-react-table';
import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IQuestionBank } from 'apis/qusetions/questions.interfaces';
import { useTranslation } from 'react-i18next';

function ExamQuestionPage() {
  const {
    dispatchDeleting,
    dispatchResetCrudState,
    isAdding,
    isDeleting,
    getActionId,
    isEditing,
  } = useCreateCrudState<IQuestion>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { t } = useTranslation();

  const [showActionProgress, setShowActionProgress] = useState(false);

  const examId = useSearchParams('exam');

  const subjectId = useSearchParams('subject');

  const navigate = useNavigate();
  const { pathname = '' } = useLocation();
  const actionPath = `${pathname}/action?exam=${examId}&subject=${subjectId}`;

  const handleAddClick = useCallback(() => {
    navigate(actionPath);
  }, [actionPath, navigate]);

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting(id);
    },
    [dispatchDeleting],
  );

  const {
    data: exam,
    refetch,
    isLoading,
  } = examQueries.useExamDetailsQuery(examId);

  const handleRemoveExamQuestion = async () => {
    setShowActionProgress(true);

    try {
      await examApi.removeExamQuestion(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataDeletedSuccessfully'));
      setShowActionProgress(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowActionProgress(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<IQuestionBank>[]>(
    () => [
      {
        accessorKey: 'title',
        header: t('exams.title'),
      },
    ],
    [t],
  );

  const ExamQuestionTable = GenericTablePage<IQuestionBank>;

  return (
    <ExamQuestionTable
      idProperty="examQuestionId"
      form=""
      columns={columns}
      data={exam?.questions || []}
      name="Exam Question"
      title="Exam Questions"
      isLoading={isLoading}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveExamQuestion}
      handleAddClick={handleAddClick}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      actionModalTitle={isEditing ? `Edit Exam Question` : `Add Exam Question`}
      setPagination={setPagination}
      pagination={pagination}
      withActionProgress={showActionProgress}
      permissionName="forceAllow"
    />
  );
}

export default ExamQuestionPage;
