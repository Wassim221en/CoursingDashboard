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
import { ExamTypeEnum, examType } from 'constants/constants';
import { useNavigate } from 'react-router-dom';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import courseQueries from 'apis/course/course.queries';
import lessonQueries from 'apis/lesson/lesson.queries';
import { ICourse } from 'apis/course/course.interfaces';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import { ICollegeSubject } from 'apis/college-subject/college-subject.interfaces';
import { ICollegeUnit } from 'apis/college-unit/college-unit.interfaces';
import collegeSubjectQueries from 'apis/college-subject/college-subject.queries';
import UniversityPastExamForm from 'components/forms/exam/past-exam/unversity-past-exam-form';
import { Box } from '@mui/material';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useTranslation } from 'react-i18next';
import prepareExamFormData from 'components/forms/exam/helpers/prepare-exam-form-data';
import ExamStudentsOrderModal from 'pages/exam/components/exam-students-order-modal.component';

type Props = {
  extendedPageTitle?: string;
};

function UniversityPastExamPage({ extendedPageTitle }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedExamIdForOrder, setSelectedExamIdForOrder] = useState<
    number | undefined
  >(undefined);

  const subjectId = useSearchParams('subject');

  const [course, setCourse] = useState<TAutoComplete | null>(null);

  const [collegeSubject, setCollegeSubject] = useState<TAutoComplete | null>(
    null,
  );

  const { data: courses, isLoading: isLoadingCourses } =
    courseQueries.useCoursesQuery(
      {
        courseFilter: 'College',
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

  const { data: subjectDetails, isLoading: isLoadingSubjectDetails } =
    collegeSubjectQueries.useCollegeSubjectDetailsUnitQuery(
      subjectId,
      !!subjectId,
    );

  const {
    data: universityExams,
    isLoading: isLoadingUniversity,
    refetch: refetchUniversity,
  } = examQueries.useUniversityExamsQuery({
    CollegeDetailsSubjectId: subjectId ?? 0,
    examType: ExamTypeEnum.pastExam,
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
      lessonId: data.collegeSubjectUnitIds[0]?.id
        ? null
        : data.lessonId?.id || null,
      courseId: data.collegeSubjectUnitIds[0]?.id
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

  const universityColumns = useMemo<MRT_ColumnDef<IExam>[]>(
    () => [
      {
        accessorKey: 'collegeSubject',
        header: t('subjects.subject'),
        Cell: ({ cell }) => cell.getValue<ICollegeSubject>()?.name ?? '',
      },
      {
        accessorKey: 'collegeSubjectUnit',
        header: t('exams.unit'),
        Cell: ({ cell }) => cell.getValue<ICollegeUnit>()?.title ?? '',
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
          <UniversityPastExamForm
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

export default UniversityPastExamPage;
