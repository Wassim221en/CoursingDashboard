import { useCallback, useMemo, useState } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import FilterGroup, {
  TFilter,
} from 'components/common/filter-group/filter-group.component';
import courseQueries from 'apis/course/course.queries';
import lessonQueries from 'apis/lesson/lesson.queries';
import schoolUnitQueries from 'apis/school-unit/school-unit.queries';
import schoolSubjectQueries from 'apis/school-subject/school-subject.queries';
import { ICourse } from 'apis/course/course.interfaces';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import { ISchoolSubject } from 'apis/school-subject/school-subject.interfaces';
import { ISchoolUnit } from 'apis/school-unit/school-unit.interfaces';
import SchoolpastExamForm from 'components/forms/exam/past-exam/school-past-exam-form';
import { Box } from '@mui/material';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import routesNames from 'routes/constants';
import { useTranslation } from 'react-i18next';
import prepareExamFormData from 'components/forms/exam/helpers/prepare-exam-form-data';
import ExamStudentsOrderModal from 'pages/exam/components/exam-students-order-modal.component';

type Props = {
  extendedPageTitle?: string;
};
function SchoolPastExamPage({ extendedPageTitle }: Props) {
  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);

  const navigate = useNavigate();
  const subjectId = useSearchParams('subject');

  const { pathname = ' ' } = useLocation();

  const isSchoolExam = pathname === routesNames.schoolSubjectsDetails;

  const [course, setCourse] = useState<TAutoComplete | null>(null);
  const [lesson, setLesson] = useState<TAutoComplete | null>(null);

  const [schoolSubject, setSchoolSubject] = useState<TAutoComplete | null>(
    null,
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedExamIdForOrder, setSelectedExamIdForOrder] = useState<
    number | undefined
  >(undefined);

  const [schoolSubjectUnit, setSchoolSubjectUnit] =
    useState<TAutoComplete | null>(null);

  const { data: courses, isLoading: isLoadingCourses } =
    courseQueries.useCoursesQuery(
      {
        courseFilter: CourseFilterType.school,
      },
      Boolean(schoolSubject && schoolSubject.id),
    );

  const { data: lessons, isFetching: isLoadingLessons } =
    lessonQueries.useLessonsQuery(
      {
        courseId: course?.id || 0,
      },
      Boolean(schoolSubject && schoolSubject.id),
    );

  const { data: schoolSubjects, isLoading: isLoadingSchoolSubjects } =
    schoolSubjectQueries.useSchoolSubjectsQuery();

  const {
    data: schoolSubjectsUnits,
    isFetching: isLoadingSchoolSubjectsUnits,
  } = schoolUnitQueries.useGradeSubjectUnitsQuery(
    {
      gradeSubjectId: schoolSubject?.id || null,
    },
    !!schoolSubject?.id,
  );

  const schoolFilters: TFilter[] = [
    {
      label: 'subject',
      value: schoolSubject,
      setValue: setSchoolSubject,
      isLoading: isLoadingSchoolSubjects,
      options: schoolSubjects?.data || [],
    },
    {
      label: 'unit',
      value: schoolSubjectUnit,
      setValue: setSchoolSubjectUnit,
      isLoading: isLoadingSchoolSubjectsUnits,
      options:
        schoolSubjectsUnits?.data?.map((item) => ({
          id: item.id,
          name: item.title,
        })) || [],
    },
  ];

  const filterArr: TFilter[] = [
    {
      label: 'course',
      value: course,
      setValue: setCourse,
      options:
        courses?.data.map((c) => ({
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
    ...schoolFilters,
  ];

  // exams queries

  const {
    data: schoolExams,
    isLoading: isLoadingSchool,
    refetch: refetchSchool,
  } = examQueries.useSchoolExamsQuery({
    courseId: course?.id,
    lessonId: lesson?.id,
    gradeSubjectId: isSchoolExam ? subjectId : schoolSubject?.id,
    gradeSubjectUnitId: schoolSubjectUnit?.id,
    examType: ExamTypeEnum.pastExam,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const refetch = refetchSchool;

  const exams = schoolExams;

  const isLoading = isLoadingSchool;

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
        `/schoolExamQuestions/action?exam=${data.id}&subject=${data.gradeSubject?.id}`,
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
      lessonId: data.gradeSubjectId?.id ? null : data.lessonId?.id || null,
      courseId: data.gradeSubjectId?.id ? null : data.courseId?.id || null,
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
        Cell: ({ cell }) => t(getNameById(examType, cell.getValue<string>())),
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

  const schoolColumns = useMemo<MRT_ColumnDef<IExam>[]>(
    () => [
      {
        accessorKey: 'gradeSubject',
        header: t('subjects.subject'),
        Cell: ({ cell }) => cell.getValue<ISchoolSubject>()?.name ?? '',
      },
      {
        accessorKey: 'gradeSubjectUnit',
        header: t('exams.unit'),
        Cell: ({ cell }) => cell.getValue<ISchoolUnit>()?.title ?? '',
      },
    ],
    [t],
  );

  const columns = useMemo<MRT_ColumnDef<IExam>[]>(
    () => [...commonColumns, ...schoolColumns],
    [commonColumns, schoolColumns],
  );

  const ExamTable = GenericTablePage<IExam>;

  return (
    <Box>
      <ExamTable
        form={
          <SchoolpastExamForm
            editItem={getSelectedData()}
            onSubmit={(data) => handleExamAction(data)}
            courseId={course}
            courses={courses?.data || []}
            isLoadingCourses={isLoadingCourses}
            isLoadingLessons={isLoadingLessons}
            isLoadingSchoolSubjects={isLoadingSchoolSubjects}
            isLoadingSchoolSubjectsUnits={isLoadingSchoolSubjectsUnits}
            lessons={lessons?.data || []}
            schoolSubjectId={schoolSubject}
            schoolSubjects={schoolSubjects?.data || []}
            schoolSubjectsUnits={schoolSubjectsUnits?.data || []}
            setCourse={setCourse}
            setSchoolSubject={setSchoolSubject}
          />
        }
        columns={columns}
        data={exams?.data || []}
        name={String(t('exams.pastExam'))}
        title={`${String(t('exams.pastExams'))} ${
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
        actionModalTitle={
          isEditing
            ? String(t('exams.editPastExam'))
            : String(t('exams.addPastExam'))
        }
        handleDetailsClick={handleDetailsClick}
        handleAddItemClick={handleShowStudentsOrder}
        addTooltip={String(t('courses.studentsOrder'))}
        setPagination={setPagination}
        pagination={pagination}
        totalRecords={exams?.totalRecords || 0}
        detailsTooltip="Show Questions"
        extra={!subjectId && <FilterGroup filterArr={filterArr} />}
        width={800}
        withActionProgress={showActionProgress}
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

export default SchoolPastExamPage;
