/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
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
import { ICourse } from 'apis/course/course.interfaces';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import { ICollegeSubject } from 'apis/college-subject/college-subject.interfaces';
import collegeSubjectQueries from 'apis/college-subject/college-subject.queries';
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import UniversityLiveExamForm from 'components/forms/liveExams/universityLiveExam/university-live-exam.form';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import FilterAutoComplete from 'components/common/filter-auto-complete/filter-auto-complete.component';
import collegeQueries from 'apis/college/college.queries';
import collegeDetailsQueries from 'apis/college-details/college-details.queries';
import ProtectPage from 'components/common/protect-page/protectPage';
import useDebounce from 'hooks/use-debounce/useDebounce';
import FilterString from 'components/common/filter-string/filter-string.component';
import { convertUtcDateToLocaleDate } from 'utils/helpers';
import prepareExamFormData from 'components/forms/exam/helpers/prepare-exam-form-data';
import ExamStudentsOrderModal from 'pages/exam/components/exam-students-order-modal.component';

type Props = {
  extendedPageTitle?: string;
};

function UniversityLiveExamPage({ extendedPageTitle }: Props) {
  const subjectId = useSearchParams('subject');

  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);

  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedExamIdForOrder, setSelectedExamIdForOrder] = useState<
    number | undefined
  >(undefined);

  const [course, setCourse] = useState<TAutoComplete | null>(null);

  const [collegeSubject, setCollegeSubject] = useState<TAutoComplete | null>(
    null,
  );

  // filters states
  const [collegeDetailsSubjectId, setCollegeDetailsSubjectId] =
    useState<TAutoComplete | null>(null);

  const [collegeId, setCollegeId] = useState<TAutoComplete | null>(null);

  const [courseFilter, setCourseFilter] = useState<TAutoComplete | null>(null);

  const [lessonFilter, setLessonFilter] = useState<TAutoComplete | null>(null);

  const [query, setQuery] = useState('');

  const queryString = useDebounce(query, 500);

  // queries

  const { data: subjectDetails, isLoading: isLoadingSubjectDetails } =
    collegeSubjectQueries.useCollegeSubjectDetailsUnitQuery(
      subjectId,
      !!subjectId,
    );

  const { data: collegeSubjectsFilters } =
    collegeDetailsQueries.useGetAllCollegeDetailsQuery({
      collegeId: collegeId?.id || 0,
    });

  const { data: colleges } = collegeQueries.useCollegesQuery({}, false);

  const { data: courses, isLoading: isLoadingCourses } =
    courseQueries.useCoursesQuery(
      {
        courseFilter: CourseFilterType.college,
      },
      Boolean(collegeSubject && collegeSubject.id),
    );

  const { data: lessons, isFetching: isLoadingLessons } =
    lessonQueries.useLessonsQuery(
      {
        courseId: course?.id || 0,
      },
      Boolean(collegeSubject && collegeSubject.id),
    );

  const { data: lessonsFilters } = lessonQueries.useLessonsQuery(
    {
      courseId: courseFilter?.id || 0,
    },
    Boolean(!courseFilter?.id),
  );

  const {
    data: universityExams,
    isLoading: isLoadingUniversity,
    refetch: refetchUniversity,
  } = examQueries.useUniversityExamsQuery({
    CollegeDetailsSubjectId: subjectId
      ? subjectId
      : collegeDetailsSubjectId?.id
      ? collegeDetailsSubjectId?.id
      : 0,
    courseId: courseFilter?.id,
    lessonId: lessonFilter?.id,
    text: queryString,
    examType: ExamTypeEnum.liveExam,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const refetch = refetchUniversity;

  const exams = universityExams;

  const isLoading = isLoadingUniversity;

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
      navigate(
        `/universityExamQuestions/action?exam=${data.id}&subject=${data.collegeSubject?.id}`,
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
      lessonId: data.collegeSubjectUnitIds.length
        ? null
        : data.lessonId?.id || null,
      courseId: data.collegeSubjectUnitIds.length
        ? null
        : data.courseId?.id || null,
      examType: ExamTypeEnum.liveExam,
      examTime: data.examTime,
      examLiveDate: new Date(data.examLiveDate || 0).toISOString() || null,
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
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
        await refetch();
      } else {
        const formData = prepareExamFormData({
          data: formPayload,
          files,
          urlsForRemove,
        });
        await examApi.addExam(formData);
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
        await refetch();
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
        accessorKey: 'examLiveDate',
        header: t('exams.examLiveDate'),
        Cell: ({ cell }) => convertUtcDateToLocaleDate(cell.getValue<string>()),
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

  const universityColumns = useMemo<MRT_ColumnDef<IExam>[]>(
    () => [
      {
        accessorKey: 'collegeSubject',
        header: t('exams.subject'),
        Cell: ({ cell }) => cell.getValue<ICollegeSubject>()?.name ?? '',
      },
    ],
    [t],
  );

  const columns = useMemo<MRT_ColumnDef<IExam>[]>(
    () => [...commonColumns, ...universityColumns],
    [commonColumns, universityColumns],
  );

  const ExamTable = GenericTablePage<IExam>;

  return (
    <Box>
      <ExamTable
        form={
          <UniversityLiveExamForm
            editItem={getSelectedData()}
            onSubmit={(data) => handleExamAction(data)}
            collegeDetailsSubjectId={collegeSubject}
            collegeSubjects={subjectDetails || null}
            collegeSubjectsUnits={subjectDetails?.units || []}
            courseId={course}
            courses={courses?.data || []}
            isLoadingCollegeSubjects={isLoadingSubjectDetails}
            isLoadingCollegeSubjectsUnits={isLoadingSubjectDetails}
            isLoadingCourses={isLoadingCourses}
            isLoadingLessons={isLoadingLessons}
            lessons={lessons?.data || []}
            setCollegeSubject={setCollegeSubject}
            setCourse={setCourse}
          />
        }
        columns={columns}
        data={exams?.data || []}
        name={String(t('exams.liveExam'))}
        title={`${String(t('exams.liveExams'))} ${
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
            ? String(t('exams.editLiveExam'))
            : String(t('exams.addLiveExam'))
        }
        setPagination={setPagination}
        pagination={pagination}
        totalRecords={exams?.totalRecords || 0}
        handleDetailsClick={handleDetailsClick}
        handleAddItemClick={handleShowStudentsOrder}
        addTooltip={String(t('courses.studentsOrder'))}
        detailsTooltip="Show Questions"
        width={800}
        withActionProgress={showActionProgress}
        permissionName="UniversityLiveExams"
        extra={
          !subjectId && (
            <Grid container gap={2}>
              <FilterAutoComplete
                defaultValue={collegeId?.id || 0}
                onChange={(v) => setCollegeId(v)}
                value={collegeId}
                label={String(t('universities.colleges'))}
                options={colleges?.data ?? []}
                disabled={!!courseFilter?.id}
              />
              <FilterAutoComplete
                defaultValue={collegeDetailsSubjectId?.id || 0}
                onChange={(v) => setCollegeDetailsSubjectId(v)}
                value={collegeDetailsSubjectId}
                label={String(t('exams.subject'))}
                options={
                  collegeSubjectsFilters?.data
                    .flatMap((d) => d.subjects)
                    .map((d) => ({
                      id: d.id,
                      name: d.name,
                    })) || []
                }
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
                disabled={!!collegeDetailsSubjectId?.id}
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
  Page: UniversityLiveExamPage,
  controllerName: ControllersNames.UniversityLiveExams,
});
