/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import examQueries from 'apis/exam/exam.queries';
import {
  IExam,
  IExamPayload,
  IExamPayloadForm,
} from 'apis/exam/exam.interfaces';
import { showError, showSuccess } from 'libs/react.toastify';
import examApi from 'apis/exam/exam.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import CourseQuizForm from 'components/forms/course-quiz/course-quiz.form';
import { useTranslation } from 'react-i18next';
import routesNames from 'routes/constants';
import { ExamTypeEnum } from 'constants/constants';
import prepareExamFormData from 'components/forms/exam/helpers/prepare-exam-form-data';
import ExamStudentsOrderModal from 'pages/exam/components/exam-students-order-modal.component';

type Props = {
  extendedPageTitle?: string;
};

function CourseQuizPage({ extendedPageTitle }: Props) {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { pathname = '' } = useLocation();

  const isUniversity = pathname === routesNames.universityCourseDetails;
  const isSchool = pathname === routesNames.schoolCourseDetails;

  const [showActionProgress, setShowActionProgress] = useState(false);

  const coursetId = useSearchParams('course');

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedExamIdForOrder, setSelectedExamIdForOrder] = useState<
    number | undefined
  >(undefined);

  const {
    data: Quizs,
    isLoading,
    refetch,
  } = examQueries.useExamsQuery({
    courseId: coursetId,
    examType: ExamTypeEnum.quiz,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const [orderedQuizes, setOrderedQuizes] = useState<IExam[]>([]);
  useEffect(() => setOrderedQuizes(Quizs?.data ?? []), [Quizs?.data]);

  // CRUD handlers
  const {
    dispatchAdding,
    dispatchDeleting,
    dispatchEditing,
    dispatchResetCrudState,
    getSelectedData,
    isAdding,
    isDeleting,
    getActionId,
    isEditing,
  } = useCreateCrudState<IExam>();

  const handleEditClick = useCallback(
    (data: IExam) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting(id);
    },
    [dispatchDeleting],
  );

  const handleDetailsClick = useCallback(
    (data: IExam) => {
      data.gradeSubject?.id
        ? navigate(
            `/schoolExamQuestions/action?exam=${data.id}&subject=${data.gradeSubject?.id}`,
          )
        : data.collegeSubject?.id
        ? navigate(
            `/universityExamQuestions/action?exam=${data.id}&subject=${data.collegeSubject?.id}`,
          )
        : navigate(
            `/specializeExamQuestions/action?exam=${data.id}&subject=${data.specializedId}`,
          );
    },
    [navigate],
  );

  const handleShowStudentsOrder = useCallback((data: IExam) => {
    setSelectedExamIdForOrder(data.id);
  }, []);

  const handleRemoveExam = async () => {
    setShowActionProgress(true);

    try {
      await examApi.removeExam(getActionId());
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

  const handleExamAction = async ({
    data,
    files,
    urlsForRemove,
  }: TSubmitHandlerData<IExamPayloadForm>) => {
    const formPayload: IExamPayload = {
      ...data,
      collegeDetailsSubjectId: null,
      gradeSubjectId: null,
      collegeSubjectUnitIds: null,
      gradeSubjectUnitIds: null,
      specializedId: null,
      lessonId: data.lessonId?.id || null,
      courseId: data.courseId?.id || null,
      examType: ExamTypeEnum.quiz,
      examTime: data.examTime,
    };

    try {
      if (getSelectedData()?.id) {
        const payload = { ...formPayload, id: getSelectedData()?.id };
        const formData = prepareExamFormData({
          data: payload,
          files,
          urlsForRemove,
        });
        await examApi.updateExam(formData);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const formData = prepareExamFormData({
          data: formPayload,
          files,
          urlsForRemove,
        });
        await examApi.addExam(formData);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const commonColumns = useMemo<MRT_ColumnDef<IExam>[]>(
    () => [
      {
        accessorKey: 'title',
        header: t('exams.title'),
      },
      {
        accessorKey: 'course.title',
        header: t('courses.course'),
      },
      {
        accessorKey: 'examTime',
        header: t('exams.examTime'),
      },
    ],
    [t],
  );

  const universityCourseColumns = useMemo<MRT_ColumnDef<IExam>[]>(
    () => [
      {
        accessorKey: 'title',
        header: t('exams.title'),
      },
      {
        accessorKey: 'course.title',
        header: t('courses.course'),
      },
      {
        accessorKey: 'collegeSubject.name',
        header: t('subjects.subject'),
      },
      {
        accessorKey: 'collegeDetails.collegeName',
        header: t('universities.college'),
      },
      {
        accessorKey: 'examTime',
        header: t('exams.examTime'),
      },
    ],
    [t],
  );

  const schoolCourseColumns = useMemo<MRT_ColumnDef<IExam>[]>(
    () => [
      {
        accessorKey: 'title',
        header: t('exams.title'),
      },
      {
        accessorKey: 'course.title',
        header: t('courses.course'),
      },
      {
        accessorKey: 'gradeSubject.name',
        header: t('subjects.subject'),
      },
      {
        accessorKey: 'grade.name',
        header: t('grades.grade'),
      },
      {
        accessorKey: 'examTime',
        header: t('exams.examTime'),
      },
    ],
    [t],
  );

  const columns = isUniversity
    ? universityCourseColumns
    : isSchool
    ? schoolCourseColumns
    : commonColumns;

  const ExamTable = GenericTablePage<IExam>;

  const handleOrderChange = async (oldIdx: number, newIdx: number) => {
    const start = Math.min(oldIdx, newIdx);
    const end = Math.max(oldIdx, newIdx);
    const desc = oldIdx > newIdx;

    const target = orderedQuizes[oldIdx];

    const effectedItems = orderedQuizes.slice(
      desc ? start : start + 1,
      desc ? end : end + 1,
    );

    const orderList = effectedItems.map((i) => i.order).concat(target.order);
    const targetNewOrder = desc
      ? Math.max(...orderList)
      : Math.min(...orderList);

    setOrderedQuizes((prev) => {
      const newArray = [...prev];
      newArray.splice(desc ? end : start, 1);
      newArray.splice(desc ? start : end, 0, target);
      return newArray;
    });

    try {
      await examApi.updateExamOrder(target.id!, targetNewOrder);
      await Promise.all([
        ...effectedItems.map((item) =>
          examApi.updateExamOrder(
            item.id!,
            desc ? item.order - 1 : item.order + 1,
          ),
        ),
      ]);
      showSuccess(t('common.dataUpdatedSuccessfully'));
    } catch (error) {
      console.error(error);
      showError(t('common.somethingWentWrong'));
    }
    refetch();
  };

  return (
    <Box>
      <ExamTable
        tableProps={{
          enableRowOrdering: true,
          muiRowDragHandleProps: ({ table }) => ({
            onDragEnd: () => {
              const oldIdx = table.getState().draggingRow?.index;
              const newIdx = table.getState().hoveredRow?.index;
              if (oldIdx !== newIdx)
                handleOrderChange(oldIdx ?? 0, newIdx ?? 0);
            },
          }),
        }}
        form={
          <CourseQuizForm
            editItem={getSelectedData()}
            onSubmit={(data) => handleExamAction(data)}
          />
        }
        columns={columns}
        data={orderedQuizes}
        name={String(t('courses.courseQuiz'))}
        title={`${String(t('courses.courseQuizs'))} ${
          extendedPageTitle?.length ? `/${extendedPageTitle}` : ``
        }`}
        isLoading={isLoading}
        handleEditClick={handleEditClick}
        openDeleteModal={isDeleting}
        setOpenDeleteModal={dispatchResetCrudState}
        handleRemoveClick={handleRemoveClick}
        handleDeleteSubmit={handleRemoveExam}
        handleAddClick={dispatchAdding}
        openActionModal={isAdding || isEditing}
        setOpenActionModal={dispatchResetCrudState}
        withActionProgress={showActionProgress}
        actionModalTitle={
          isEditing
            ? String(t('courses.editCourseQuiz'))
            : String(t('courses.addCourseQuiz'))
        }
        handleDetailsClick={handleDetailsClick}
        handleAddItemClick={handleShowStudentsOrder}
        addTooltip={String(t('courses.studentsOrder'))}
        setPagination={setPagination}
        pagination={pagination}
        totalRecords={Quizs?.totalRecords || 0}
        detailsTooltip="Show Questions"
        width={800}
        permissionName="forceAllow"
      />
      <ExamStudentsOrderModal
        examId={selectedExamIdForOrder}
        open={!!selectedExamIdForOrder}
        setOpen={(value) => {
          if (!value) setSelectedExamIdForOrder(undefined);
        }}
      />
    </Box>
  );
}

export default CourseQuizPage;
