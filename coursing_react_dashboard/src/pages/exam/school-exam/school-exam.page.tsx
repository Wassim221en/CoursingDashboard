/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
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
import { getNameById } from 'hooks/use-generic-form/helpers';
import {
  ControllersNames,
  CourseFilterType,
  ExamTypeEnum,
  examType,
} from 'constants/constants';
import { useNavigate } from 'react-router-dom';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import courseQueries from 'apis/course/course.queries';
import lessonQueries from 'apis/lesson/lesson.queries';
import schoolUnitQueries from 'apis/school-unit/school-unit.queries';
import { ICourse } from 'apis/course/course.interfaces';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import { ISchoolSubject } from 'apis/school-subject/school-subject.interfaces';
import SchoolExamForm from 'components/forms/exam/school-exam/school-exam.form';
import { Box, Grid } from '@mui/material';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useTranslation } from 'react-i18next';
import gradeQueries from 'apis/grade/grade.queries';
import FilterAutoComplete from 'components/common/filter-auto-complete/filter-auto-complete.component';
import ProtectPage from 'components/common/protect-page/protectPage';
import useDebounce from 'hooks/use-debounce/useDebounce';
import FilterString from 'components/common/filter-string/filter-string.component';
import prepareExamFormData from 'components/forms/exam/helpers/prepare-exam-form-data';
import ExamStudentsOrderModal from '../components/exam-students-order-modal.component';

type Props = {
  extendedPageTitle?: string;
};
function SchoolExamPage({ extendedPageTitle }: Props) {
  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);

  const navigate = useNavigate();

  const subjectId = useSearchParams('subject');

  const [gardeSubject, setGradeSubject] = useState<TAutoComplete | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedExamIdForOrder, setSelectedExamIdForOrder] = useState<
    number | undefined
  >(undefined);
  // const isSchoolExam = pathname === routesNames.schoolSubjectsDetails;

  const [course, setCourse] = useState<TAutoComplete | null>(null);

  // filters states
  const [gradeId, setGradeId] = useState<TAutoComplete | null>(null);
  const [gradeSubjectId, setGradeSubjectId] = useState<TAutoComplete | null>(
    null,
  );
  const [courseFilter, setCourseFilter] = useState<TAutoComplete | null>(null);

  const [lessonFilter, setLessonFilter] = useState<TAutoComplete | null>(null);

  const [query, setQuery] = useState('');

  const queryString = useDebounce(query, 500);

  // queries

  const { data: courses, isLoading: isLoadingCourses } =
    courseQueries.useCoursesQuery(
      {
        courseFilter: CourseFilterType.school,
      },
      Boolean(gardeSubject && gardeSubject.id),
    );

  const { data: lessons, isFetching: isLoadingLessons } =
    lessonQueries.useLessonsQuery(
      {
        courseId: course?.id || 0,
      },
      Boolean(gardeSubject && gardeSubject.id),
    );

  const { data: lessonsFilters } = lessonQueries.useLessonsQuery(
    {
      courseId: courseFilter?.id || 0,
    },
    Boolean(!courseFilter?.id),
  );

  const { data: grades } = gradeQueries.useGradesQuery();

  const { data: filteredGradeSubjects } = gradeQueries.useGradeSubjectsQuery(
    { gradeId: gradeId?.id },
    !gradeId?.id,
  );

  const { data: gradeSubjects, isLoading: isLoadinggradeSubjects } =
    gradeQueries.useGradeSubjectsQuery({ gradeId: 0 }, false);

  const { data: gradeSubjectsUnits, isFetching: isLoadingSchoolSubjectsUnits } =
    schoolUnitQueries.useGradeSubjectUnitsQuery({
      gradeSubjectId: gardeSubject?.id || 0,
    });

  // exams queries

  const {
    data: exams,
    isLoading,
    refetch,
  } = examQueries.useSchoolExamsQuery({
    gradeSubjectId: subjectId
      ? subjectId
      : gradeSubjectId?.id
      ? gradeSubjectId.id
      : 0,
    courseId: courseFilter?.id,
    lessonId: lessonFilter?.id,
    text: queryString,
    examType: ExamTypeEnum.quizAndExam,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const [orderedExams, setOrderedExams] = useState<IExam[]>([]);
  useEffect(() => {
    setOrderedExams(() => exams?.data ?? []);
  }, [exams?.data]);

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
        `/schoolExamQuestions/action?exam=${data.id}&subject=${data.gradeSubject.id}`,
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
        data.gradeSubjectUnitIds?.length > 0
          ? data.gradeSubjectUnitIds?.map((schoolUnit) => schoolUnit.id)
          : null,
      specializedId: data.specializedId || null,
      lessonId: data.gradeSubjectId?.id ? null : data.lessonId?.id || null,
      courseId: data.gradeSubjectId?.id ? null : data.courseId?.id || null,
      examType: data.examType.id,
      examTime: data.examTime,
    };
    console.log(data.gradeSubjectUnitIds);
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
        accessorKey: 'maxMark',
        header: t('exams.maxMark'),
      },
      {
        accessorKey: 'minMark',
        header: t('exams.minMark'),
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
        header: t('exams.subject'),
        Cell: ({ cell }) => cell.getValue<ISchoolSubject>()?.name ?? '',
      },
      {
        accessorKey: 'grade.name',
        header: t('grades.grade'),
      },
    ],
    [t],
  );

  const columns = useMemo<MRT_ColumnDef<IExam>[]>(
    () => [...commonColumns, ...schoolColumns],
    [commonColumns, schoolColumns],
  );

  const ExamTable = GenericTablePage<IExam>;

  const handleOrderChange = async (oldIdx: number, newIdx: number) => {
    const start = Math.min(oldIdx, newIdx);
    const end = Math.max(oldIdx, newIdx);
    const desc = oldIdx > newIdx;

    const target = orderedExams[oldIdx];

    const effectedItems = orderedExams.slice(
      desc ? start : start + 1,
      desc ? end : end + 1,
    );

    const orderList = effectedItems.map((i) => i.order).concat(target.order);
    const targetNewOrder = desc
      ? Math.max(...orderList)
      : Math.min(...orderList);

    setOrderedExams((prev) => {
      const newArray = [...prev];
      newArray.splice(desc ? end : start, 1);
      newArray.splice(desc ? start : end, 0, target);
      return newArray;
    });

    try {
      await examApi.updateExamOrder(target.id!, targetNewOrder);
      await Promise.all(
        effectedItems.map((item) =>
          examApi.updateExamOrder(
            item.id!,
            desc ? item.order - 1 : item.order + 1,
          ),
        ),
      );
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
          <SchoolExamForm
            editItem={getSelectedData()}
            onSubmit={(data) => handleExamAction(data)}
            courseId={course}
            courses={courses?.data || []}
            isLoadingCourses={isLoadingCourses}
            isLoadingLessons={isLoadingLessons}
            isLoadingSchoolSubjects={isLoadinggradeSubjects}
            isLoadingSchoolSubjectsUnits={isLoadingSchoolSubjectsUnits}
            lessons={lessons?.data || []}
            gradeSubjectId={gardeSubject}
            schoolSubjects={gradeSubjects?.data || []}
            GradeSubjectsUnits={gradeSubjectsUnits?.data || []}
            setCourse={setCourse}
            setGradeSubject={setGradeSubject}
          />
        }
        columns={columns}
        data={orderedExams}
        name={String(t('exams.exam'))}
        title={`${String(t('exams.exams'))} ${
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
        setPagination={setPagination}
        pagination={pagination}
        totalRecords={exams?.totalRecords || 0}
        actionModalTitle={
          isEditing ? String(t('exams.editExam')) : String(t('exams.addExam'))
        }
        handleDetailsClick={handleDetailsClick}
        handleAddItemClick={handleShowStudentsOrder}
        addTooltip={String(t('courses.studentsOrder'))}
        detailsTooltip="Show Questions"
        withActionProgress={showActionProgress}
        width={800}
        permissionName="SchoolingExams"
        extra={
          !subjectId && (
            <Grid container gap={2}>
              <FilterAutoComplete
                defaultValue={gradeId?.id || 0}
                onChange={(v) => setGradeId(v)}
                value={gradeId}
                label={String(t('grades.grades'))}
                options={
                  grades?.data?.map((grade) => ({
                    id: grade?.id,
                    name: grade?.name,
                  })) || []
                }
                disabled={!!courseFilter?.id}
              />
              <FilterAutoComplete
                defaultValue={gradeSubjectId?.id || 0}
                onChange={(v) => setGradeSubjectId(v)}
                value={gradeSubjectId}
                label={String(t('exams.subject'))}
                options={
                  filteredGradeSubjects?.data.map((gradeSubject) => ({
                    id: gradeSubject.id,
                    name: gradeSubject.subject.name,
                  })) || []
                }
                disabled={!gradeId?.id}
              />
              <FilterAutoComplete
                defaultValue={courseFilter?.id || 0}
                onChange={(v) => setCourseFilter(v)}
                value={courseFilter}
                label={String(t('courses.courses'))}
                options={
                  courses?.data.map((c) => ({
                    id: c.id,
                    name: c.title,
                  })) || []
                }
                disabled={!!gradeSubjectId?.id}
              />
              <FilterAutoComplete
                defaultValue={lessonFilter?.id || 0}
                onChange={(v) => setLessonFilter(v)}
                value={lessonFilter}
                label={String(t('exams.lessons'))}
                options={
                  lessonsFilters?.data.map((l) => ({
                    id: l.id,
                    name: l.title,
                  })) || []
                }
                disabled={!courseFilter?.id}
              />
              <FilterString query={query} setQuery={setQuery} />
            </Grid>
          )
        }
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

export default ProtectPage({
  Page: SchoolExamPage,
  controllerName: ControllersNames.SchoolingExams,
});
