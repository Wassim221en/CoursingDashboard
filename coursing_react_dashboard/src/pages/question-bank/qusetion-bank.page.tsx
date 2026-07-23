/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-nested-ternary */
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useCallback, useMemo, useState } from 'react';
import { IQuestionBank } from 'apis/qusetions/questions.interfaces';
import QuestionQueries from 'apis/qusetions/questions.queries';
import QuestionApi from 'apis/qusetions/questions.api';
import { showSuccess } from 'libs/react.toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { sanitizeHtml } from 'utils/helpers';
import { MRT_ColumnDef } from 'material-react-table';
import { getNameById } from 'hooks/use-generic-form/helpers';
import {
  CourseFilterType,
  QuestionLevel,
  QuestionType,
} from 'constants/constants';
import { useTranslation } from 'react-i18next';
import routesNames from 'routes/constants';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import useDebounce from 'hooks/use-debounce/useDebounce';
import FilterString from 'components/common/filter-string/filter-string.component';
import ProtectPage from 'components/common/protect-page/protectPage';
import FadeModal from 'components/common/generic-table-page/components/fade-modal/fade-modal.component';
import { Avatar, Box, Grid } from '@mui/material';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import FilterAutoComplete from 'components/common/filter-auto-complete/filter-auto-complete.component';
import gradeQueries from 'apis/grade/grade.queries';
import schoolUnitQueries from 'apis/school-unit/school-unit.queries';
import collegeDetailsQueries from 'apis/college-details/college-details.queries';
import collegeQueries from 'apis/college/college.queries';
import collegeSubjectQueries from 'apis/college-subject/college-subject.queries';
import specializedQueries from 'apis/specialized/specialized.queries';
import AddingTypeModal from './components/AddingTypeModal/AddingTypeModal.component';

type Props = {
  extendedPageTitle?: string;
};
function QuestionsBank({ extendedPageTitle }: Props) {
  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);
  const [openAddingTypeModal, setOpenAddingTypeModal] = useState(false);

  const [specializedId, setSpecializedId] = useState<TAutoComplete | null>(
    null,
  );

  // filters states
  const [schoolSubjectUnit, setSchoolSubjectUnit] =
    useState<TAutoComplete | null>(null);
  const [collegeSubjectUnit, setCollegeSubjectUnit] =
    useState<TAutoComplete | null>(null);
  const [collegeId, setCollegeId] = useState<TAutoComplete | null>(null);
  const [gradeId, setGradeId] = useState<TAutoComplete | null>(null);
  const [gradeSubjectId, setGradeSubjectId] = useState<TAutoComplete | null>(
    null,
  );
  const [courseFilter, setCourseFilter] = useState<TAutoComplete | null>(null);

  const navigate = useNavigate();
  const { pathname = '' } = useLocation();
  const subjectId = useSearchParams('subject');

  // filters
  const [query, setQuery] = useState('');

  const queryString = useDebounce(query, 500);
  const { data: colleges } = collegeQueries.useCollegesQuery({}, false);

  const { data: collegeSubjectsFilters } =
    collegeDetailsQueries.useGetAllCollegeDetailsQuery({
      collegeId: collegeId?.id || 0,
    });
  const [collegeDetailsSubjectId, setCollegeDetailsSubjectId] =
    useState<TAutoComplete | null>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const actionPath = `${pathname}/actionQuestion${
    subjectId ? `?subject=${subjectId}` : ''
  }`;

  const uploadExcelActionPath = `${pathname}/uploadExcel${
    subjectId ? `?subject=${subjectId}` : ''
  }`;

  const UniversitySubjectDetailsPage = pathname.includes(
    routesNames.collegeSubjectsDetails,
  );
  const SchoolSubjectDetailsPage = pathname.includes(
    routesNames.schoolSubjectsDetails,
  );
  const UniversityQusetionBank =
    pathname === routesNames.universityQuestionsBank;
  const SchoolQusetionBank = pathname === routesNames.schoolQuestionsBank;
  const specializeQuestionsBank =
    pathname === routesNames.specializeQuestionsBank;
  const SpecializedQusetionBank =
    pathname === routesNames.specializeQuestionsBank;

  const { getActionId, dispatchDeleting, dispatchResetCrudState, isDeleting } =
    useCreateCrudState<IQuestionBank>();

  const handleAddClick = useCallback(() => {
    navigate(actionPath);
  }, [actionPath, navigate]);

  const handleUploadExcelClick = useCallback(() => {
    navigate(uploadExcelActionPath);
  }, [uploadExcelActionPath, navigate]);

  const handleEditClick = useCallback(
    (data: IQuestionBank) => {
      navigate(
        `${actionPath}${subjectId ? '&' : '?'}question=${data.questionId}`,
      );
    },
    [actionPath, navigate, subjectId],
  );
  const handleRemoveClick = useCallback(
    (questionId: number) => {
      dispatchDeleting({ actionId: questionId });
    },
    [dispatchDeleting],
  );
  const {
    data: Questions,
    refetch,
    isLoading: isLoadingQuestion,
  } = QuestionQueries.useQuestionQuery(
    {
      type: SchoolQusetionBank
        ? 0
        : UniversityQusetionBank
        ? 1
        : specializeQuestionsBank
        ? 2
        : null,
      collegeDetailsSubjectId: UniversitySubjectDetailsPage
        ? subjectId
        : UniversityQusetionBank
        ? collegeDetailsSubjectId?.id
        : null,
      gradeSubjectId: SchoolSubjectDetailsPage
        ? subjectId
        : SchoolQusetionBank
        ? gradeSubjectId?.id
        : null,
      schoolSubjectUnitId: SchoolSubjectDetailsPage
        ? subjectId
        : SchoolQusetionBank
        ? schoolSubjectUnit?.id
        : null,
      collegeDetailsSubjectUnitId: UniversitySubjectDetailsPage
        ? subjectId
        : UniversityQusetionBank
        ? collegeSubjectUnit?.id
        : null,
      text: queryString,
      specialityId: SpecializedQusetionBank ? specializedId?.id : null,
      pageNumber: pagination.pageIndex,
      pageSize: pagination.pageSize,
    },
    true,
  );
  // queries
  const { data: subjectUnitsDetails, isLoading: isLoadingSubjectDetailsUnits } =
    collegeSubjectQueries.useCollegeSubjectDetailsUnitQuery(
      subjectId || collegeDetailsSubjectId?.id!,
      !!collegeDetailsSubjectId,
    );
  const { data: Specializes } = specializedQueries.useSpecializedQuery(
    !specializeQuestionsBank,
  );

  const {
    data: schoolSubjectsUnits,
    isFetching: isLoadingSchoolSubjectsUnits,
  } = schoolUnitQueries.useGradeSubjectUnitsQuery(
    {
      gradeSubjectId: gradeSubjectId?.id || null,
    },
    !gradeSubjectId?.id,
  );

  const { data: grades } = gradeQueries.useGradesQuery();

  const { data: filteredGradeSubjects } = gradeQueries.useGradeSubjectsQuery(
    { gradeId: gradeId?.id },
    !gradeId?.id,
  );

  const handleRemoveQuestion = async () => {
    setShowActionProgress(true);

    try {
      await QuestionApi.removeQuestion(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(
        t('common.deleteSuccess', { var: t('questionsBank.question') }),
      );
      setShowActionProgress(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowActionProgress(false);
    }
  };

  const QuestionTable = GenericTablePage<IQuestionBank>;

  const columns = useMemo<MRT_ColumnDef<IQuestionBank>[]>(
    () => [
      {
        accessorKey: 'body',
        header: t('questionsBank.questionTitle'),
        Cell: ({
          cell: { getValue },
          row: {
            original: { imageUrl },
          },
        }) => (
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            fontSize={16}
          >
            {!!imageUrl && <Avatar src={imageUrl} />}
            {sanitizeHtml(getValue<string>())}
          </Box>
        ),
      },
      {
        accessorKey: 'title',
        header: t('questionsBank.question'),
        Cell: ({ cell }) => sanitizeHtml(cell.getValue<string>()),
      },
      {
        accessorKey: 'questionType',
        header: t('questionsBank.questionType'),
        Cell: ({ cell }) =>
          t(getNameById(QuestionType, cell.getValue<string>())),
      },
      {
        accessorKey: 'questionLevel',
        header: t('questionsBank.questionLevel'),
        Cell: ({ cell }) =>
          t(getNameById(QuestionLevel, cell.getValue<string>())),
      },
    ],
    [t],
  );

  return (
    <>
      <QuestionTable
        idProperty="questionId"
        form=""
        data={Questions?.data || []}
        columns={columns}
        name={String(t('questionsBank.question'))}
        title={`${t('questionsBank.questions')} ${
          extendedPageTitle?.length ? `/${extendedPageTitle}` : ``
        }`}
        isLoading={isLoadingQuestion}
        handleEditClick={handleEditClick}
        openDeleteModal={isDeleting}
        handleRemoveClick={handleRemoveClick}
        handleDeleteSubmit={handleRemoveQuestion}
        handleAddClick={() => setOpenAddingTypeModal(true)}
        setOpenDeleteModal={dispatchResetCrudState}
        setPagination={setPagination}
        pagination={pagination}
        totalRecords={Questions?.totalRecords || 0}
        withActionProgress={showActionProgress}
        permissionName={
          UniversityQusetionBank
            ? 'UniversityQuestionBank'
            : SchoolQusetionBank
            ? 'SchoolingQuestionBank'
            : 'SpecialtyQuestionBank'
        }
        extra={
          <Grid container gap={2}>
            {UniversityQusetionBank ? (
              <>
                <FilterAutoComplete
                  defaultValue={collegeId?.id || 0}
                  onChange={(v) => setCollegeId(v)}
                  value={collegeId}
                  label={String(t('universities.colleges'))}
                  options={colleges?.data ?? []}
                  // disabled={!!courseFilter?.id}
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
                  defaultValue={collegeSubjectUnit?.id || 0}
                  onChange={(v) => setCollegeSubjectUnit(v)}
                  value={collegeSubjectUnit}
                  label={String(t('exams.unit'))}
                  options={
                    subjectUnitsDetails?.units?.map((unit) => ({
                      id: unit.id,
                      name: unit.title,
                    })) || []
                  }
                  disabled={!!gradeSubjectId?.id}
                />
              </>
            ) : (
              SchoolQusetionBank && (
                <>
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
                    defaultValue={schoolSubjectUnit?.id || 0}
                    onChange={(v) => setSchoolSubjectUnit(v)}
                    value={schoolSubjectUnit}
                    label={String(t('exams.unit'))}
                    options={
                      schoolSubjectsUnits?.data.map((unit) => ({
                        id: unit.id,
                        name: unit.title,
                      })) || []
                    }
                    disabled={!!gradeSubjectId?.id}
                  />
                </>
              )
            )}
            {specializeQuestionsBank && (
              <FilterAutoComplete
                defaultValue={specializedId?.id || 0}
                onChange={(v) => setSpecializedId(v)}
                value={specializedId}
                label={String(t('specialized.specialized'))}
                options={Specializes?.data ?? []}
              />
            )}
            <FilterString query={query} setQuery={setQuery} />
          </Grid>
        }
      />
      <FadeModal
        width={500}
        open={openAddingTypeModal}
        setOpen={setOpenAddingTypeModal}
        modalTitle={String(t('questionsBank.addingType'))}
      >
        <AddingTypeModal
          ActionManualQuestion={handleAddClick}
          ActionUploadExcel={handleUploadExcelClick}
        />
      </FadeModal>
    </>
  );
}

export default ProtectPage({
  Page: QuestionsBank,
  internalPathNameSearch: true,
});
