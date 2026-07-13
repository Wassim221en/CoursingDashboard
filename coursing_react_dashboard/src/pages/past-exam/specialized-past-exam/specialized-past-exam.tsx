import React, { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import examQueries from 'apis/exam/exam.queries';
import {
  IExam,
  IExamPayload,
  IExamPayloadForm,
} from 'apis/exam/exam.interfaces';
import { showSuccess } from 'libs/react.toastify';
import examApi from 'apis/exam/exam.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { getNameById } from 'hooks/use-generic-form/helpers';
import { CourseFilterType, ExamTypeEnum, examType } from 'constants/constants';
import { useNavigate } from 'react-router-dom';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import FilterGroup, {
  TFilter,
} from 'components/common/filter-group/filter-group.component';
import courseQueries from 'apis/course/course.queries';
import lessonQueries from 'apis/lesson/lesson.queries';
import specializedQueries from 'apis/specialized/specialized.queries';
import { ICourse } from 'apis/course/course.interfaces';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import SpecializedPastExamForm from 'components/forms/exam/past-exam/specialized-past-exam.form';
import { useTranslation } from 'react-i18next';
import prepareExamFormData from 'components/forms/exam/helpers/prepare-exam-form-data';
import ExamStudentsOrderModal from 'pages/exam/components/exam-students-order-modal.component';

function SpecializedPastExamPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);

  const [course, setCourse] = useState<TAutoComplete | null>(null);
  const [lesson, setLesson] = useState<TAutoComplete | null>(null);

  const [specialization, setSpecialization] = useState<TAutoComplete | null>(
    null,
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedExamIdForOrder, setSelectedExamIdForOrder] = useState<
    number | undefined
  >(undefined);

  const { data: courses, isLoading: isLoadingCourses } =
    courseQueries.useCoursesQuery({
      // schoolSubjectId: specialization?.id ?? 0,
      courseFilter: CourseFilterType.speciality,
    });

  const { data: lessons, isFetching: isLoadingLessons } =
    lessonQueries.useLessonsQuery({
      courseId: course?.id || 0,
    });

  const { data: specialized, isLoading: isLoadingSpecialized } =
    specializedQueries.useSpecializedQuery();

  const specializedFilters: TFilter[] = [
    {
      label: 'specialized',
      value: specialization,
      setValue: setSpecialization,
      options: specialized?.data || [],
      isLoading: isLoadingSpecialized,
    },
  ];

  const filterArr: TFilter[] = [
    {
      label: 'course',
      value: course,
      setValue: setCourse,
      options:
        courses?.data?.map((c) => ({
          id: c.id,
          name: c.title,
        })) || [],
      isLoading: isLoadingCourses,
    },
    {
      label: 'lesson',
      value: lesson,
      setValue: setLesson,
      options:
        lessons?.data?.map((l) => ({
          id: l.id,
          name: l.title,
        })) || [],
      isLoading: isLoadingLessons,
    },
    ...specializedFilters,
  ];

  const {
    data: specializedExams,
    isLoading: isLoadingSpecializedExams,
    refetch: refetchSpecialized,
  } = examQueries.useSpecializedExamsQuery({
    examType: ExamTypeEnum.pastExam,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const refetch = refetchSpecialized;

  const exams = specializedExams;

  const isLoading = isLoadingSpecializedExams;

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
      navigate(
        `/specializeExamQuestions?exam=${data.id}&subject=${data.collegeSubject?.id}`,
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
      collegeDetailsSubjectId: data.collegeDetailsSubjectId?.id || null,

      gradeSubjectId: data.gradeSubjectId?.id || null,
      collegeSubjectUnitIds:
        data.collegeSubjectUnitIds?.map((collegeUnit) => collegeUnit.id) ||
        null,
      gradeSubjectUnitIds:
        data.gradeSubjectUnitIds?.map((schoolUnit) => schoolUnit.id) || null,
      specializedId: data.specializedId || null,
      lessonId: data.collegeDetailsSubjectId?.id
        ? null
        : data.lessonId?.id || null,
      courseId: data.collegeDetailsSubjectId?.id
        ? null
        : data.courseId?.id || null,
      examType: ExamTypeEnum.pastExam,
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

  // table columns

  const commonColumns = useMemo<MRT_ColumnDef<IExam>[]>(
    () => [
      {
        accessorKey: 'title',
        header: t('exams.title'),
      },
      {
        accessorKey: 'examType',
        header: t('exams.examType'),
        Cell: ({ cell }) => getNameById(examType, cell.getValue<string>()),
      },
      {
        accessorKey: 'minMark',
        header: t('exams.minMark'),
      },
      {
        accessorKey: 'maxMark',
        header: t('exams.maxMark'),
      },
      {
        accessorKey: 'course',
        header: t('exams.course'),
        Cell: ({ cell }) => cell.getValue<ICourse>()?.title ?? '',
      },
      {
        accessorKey: 'lesson',
        header: t('exams.lesson'),
        Cell: ({ cell }) => cell.getValue<ILesson>()?.title ?? '',
      },
    ],
    [t],
  );

  const columns = useMemo<MRT_ColumnDef<IExam>[]>(
    () => [...commonColumns],
    [commonColumns],
  );

  const ExamTable = GenericTablePage<IExam>;

  return (
    <>
      <ExamTable
        form={
          <SpecializedPastExamForm
            editItem={getSelectedData()}
            onSubmit={(data) => handleExamAction(data)}
            courseId={course}
            courses={courses?.data || []}
            isLoadingCourses={isLoadingCourses}
            isLoadingLessons={isLoadingLessons}
            lessons={lessons?.data || []}
            setCourse={setCourse}
            specialized={specialized?.data || []}
            isLoadingSpecialized={isLoadingSpecialized}
          />
        }
        columns={columns}
        data={exams?.data || []}
        name={String(t('exams.pastExam'))}
        title={String(t('exams.pastExams'))}
        isLoading={isLoading}
        handleEditClick={handleEditClick}
        openDeleteModal={isDeleting}
        setOpenDeleteModal={dispatchResetCrudState}
        handleRemoveClick={handleRemoveClick}
        handleDeleteSubmit={handleRemoveExam}
        handleAddClick={dispatchAdding}
        openActionModal={isAdding || isEditing}
        setOpenActionModal={dispatchResetCrudState}
        setPagination={setPagination}
        pagination={pagination}
        totalRecords={exams?.totalRecords || 0}
        withActionProgress={showActionProgress}
        actionModalTitle={
          isEditing
            ? String(t('exams.editPastExam'))
            : String(t('exams.addPastExam'))
        }
        handleDetailsClick={handleDetailsClick}
        handleAddItemClick={handleShowStudentsOrder}
        addTooltip={String(t('courses.studentsOrder'))}
        detailsTooltip="Show Questions"
        extra={<FilterGroup filterArr={filterArr} />}
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
    </>
  );
}

export default SpecializedPastExamPage;
