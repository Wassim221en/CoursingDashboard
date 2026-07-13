/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import { ICourse } from 'apis/course/course.interfaces';
import courseQueries from 'apis/course/course.queries';
import FilterAutoComplete from 'components/common/filter-auto-complete/filter-auto-complete.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import routesNames from 'routes/constants';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import universityQueries from 'apis/university/university.queries';
import collegeQueries from 'apis/college/college.queries';
import gradeQueries from 'apis/grade/grade.queries';
import specializedQueries from 'apis/specialized/specialized.queries';
import collegeDetailsQueries from 'apis/college-details/college-details.queries';
import instructorQueries from 'apis/instructor/instructor.queries';
import ProtectPage from 'components/common/protect-page/protectPage';
import useDebounce from 'hooks/use-debounce/useDebounce';
import FilterString from 'components/common/filter-string/filter-string.component';
import { MRT_ColumnDef } from 'material-react-table';
import CellImage from 'components/common/cell-image/cell-image.component';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { showSuccess } from 'libs/react.toastify';
import courseApi from 'apis/course/course.api';
import RatingComponent from 'layout/components/rating-component/rating-component.component';
import { IInstructor } from 'apis/instructor/instructor.interfaces';
import { CourseFilterType } from 'constants/constants';
import { Publish, Unpublished } from '@mui/icons-material';

type Props = {
  extendedPageTitle?: string;
};

function CoursesPage({ extendedPageTitle }: Props) {
  const subjectId = useSearchParams('subject');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { pathname = '' } = useLocation();

  const { dispatchResetCrudState, isDeleting, dispatchDeleting, getActionId } =
    useCreateCrudState<ICourse>();

  const isUniversity = pathname === routesNames.universityCourses;
  const isSchool = pathname === routesNames.schoolCourses;
  const isSpecialized = pathname === routesNames.specializedCourses;

  const isUniversitySubject = pathname.includes(
    routesNames.collegeSubjectsDetails,
  );
  const isSchoolSubject = pathname.includes(routesNames.schoolSubjectsDetails);

  // instructors filter
  const [instructor, setInstructor] = useState<TAutoComplete | null>(null);

  // university filters
  const [universityId, setUniversityId] = useState<TAutoComplete | null>(null);
  const [collegeId, setCollegeId] = useState<TAutoComplete | null>(null);
  const [collegeDetailsSubjectId, setCollegeDetailsSubjectId] =
    useState<TAutoComplete | null>(null);

  // school filters
  const [gradeId, setGradeId] = useState<TAutoComplete | null>(null);
  const [gradeSubjectId, setGradeSubjectId] = useState<TAutoComplete | null>(
    null,
  );

  // specialized filters
  const [specializedId, setSpecializedId] = useState<TAutoComplete | null>(
    null,
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [showActionProgress, setShowActionProgress] = useState(false);

  const [query, setQuery] = useState('');

  const queryString = useDebounce(query, 500);

  // rest filters states between pages

  useEffect(() => {
    setUniversityId(null);
    setCollegeId(null);
    setCollegeDetailsSubjectId(null);
    setGradeId(null);
    setGradeSubjectId(null);
    setInstructor(null);
  }, [pathname]);

  // #region queries

  // instructors query

  const { data: instructors } = instructorQueries.useInstructorQuery();

  // university queries
  const { data: universities } = universityQueries.useUniversitiesQuery(
    {},
    !isUniversity,
  );
  const { data: colleges } = collegeQueries.useCollegesQuery(
    { universityId: universityId?.id },
    !isUniversity,
  );

  const { data: collegeSubjectDetails } =
    collegeDetailsQueries.useGetAllCollegeDetailsQuery({
      collegeId: collegeId?.id || 0,
    });

  // school queries

  const { data: grades } = gradeQueries.useGradesQuery({}, !isSchool);

  const { data: gradeSubjects } = gradeQueries.useGradeSubjectsQuery(
    { gradeId: gradeId?.id },

    !gradeId?.id,
  );

  // specialized queries

  const { data: Specializes } = specializedQueries.useSpecializedQuery(
    !isSpecialized,
  );

  const {
    data: courses,
    isLoading: isLoadingCourses,
    refetch,
  } = courseQueries.useCoursesQuery({
    universityId: universityId?.id,
    collegeId: collegeId?.id,
    collegeDetailsSubjectId: isUniversitySubject
      ? subjectId
      : collegeDetailsSubjectId?.id,
    gradeId: gradeId?.id,
    gradeSubjectId: isSchoolSubject ? subjectId : gradeSubjectId?.id,
    specializedId: isSpecialized ? specializedId?.id : null,
    courseFilter:
      isUniversity || isUniversitySubject
        ? CourseFilterType.college
        : isSchool || isSchoolSubject
        ? CourseFilterType.school
        : isSpecialized
        ? CourseFilterType.speciality
        : null,
    instructor: instructor?.id,
    text: queryString,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  // #endregion

  const actionPath = `${pathname}/actionCourse`;

  const handleAddClick = useCallback(() => {
    navigate(`${actionPath}${subjectId ? `?subject=${subjectId}` : ''}`);
  }, [actionPath, navigate]);

  const handleEditClick = useCallback(
    (data: ICourse) => {
      navigate(
        `${actionPath}?course=${data.id}${
          subjectId ? `&subject=${subjectId}` : ''
        }`,
      );
    },
    [actionPath, navigate],
  );

  const handleCourseDetailsClick = useCallback(
    (id: number) => {
      navigate(
        `${
          isUniversity || isUniversitySubject
            ? routesNames.universityCourseDetails
            : isSchool || isSchoolSubject
            ? routesNames.schoolCourseDetails
            : routesNames.specializeCourseDetails
        }?course=${id}`,
      );
    },
    [navigate],
  );

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting(id);
    },
    [dispatchDeleting],
  );

  const handleRemoveCourse = async () => {
    setShowActionProgress(true);
    try {
      await courseApi.removeCourse(getActionId());
      await refetch();
      showSuccess(t('common.dataDeletedSuccessfully'));
      setShowActionProgress(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowActionProgress(false);
    }
  };

  const handlePublish = async (course: ICourse, publishState: boolean) => {
    setShowActionProgress(true);
    try {
      await courseApi.updateCoursePublishState(course.id, publishState);
      await refetch();
      showSuccess(t('common.dataUpdatedSuccessfully'));
      setShowActionProgress(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowActionProgress(false);
    }
  };

  const columns = useMemo(() => {
    const common: MRT_ColumnDef<ICourse>[] = [
      {
        accessorKey: 'coverUrl',
        header: t('common.image'),
        Cell: ({ cell }) => <CellImage imageSrc={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'title',
        header: t('courses.course'),
      },
      {
        accessorKey: 'instructors',
        header: t('common.instructors'),
        Cell: ({ cell }) =>
          cell.getValue<IInstructor[]>()?.map((i) => i.fullName?.concat(' , ')),
      },
      {
        accessorKey: 'unReadQuestionCount',
        header: t('common.unReadQuestionCount'),
        Cell: ({ cell }) => cell.getValue<number>(),
      },
      {
        accessorKey: 'unReadReportCount',
        header: t('common.unReadReportCount'),
        Cell: ({ cell }) => cell.getValue<number>(),
      },
    ];
    const university: MRT_ColumnDef<ICourse>[] = [
      {
        accessorKey: 'subject.college.name',
        header: t('universities.college'),
      },

      {
        accessorKey: 'subject.year',
        header: t('college-details-form.year'),
      },
      {
        accessorKey: 'subject.name',
        header: t('exams.subject'),
      },
      {
        accessorKey: 'rating',
        header: t('instructors.rating'),
        Cell: ({ cell }) => (
          <RatingComponent
            value={cell.getValue<number>()}
            precision={0.5}
            readonly
          />
        ),
      },
    ];
    const school: MRT_ColumnDef<ICourse>[] = [
      {
        accessorKey: 'subject.grade.name',
        header: t('grades.grade'),
      },
      {
        accessorKey: 'subject.name',
        header: t('exams.subject'),
      },
      {
        accessorKey: 'rating',
        header: t('instructors.rating'),
        Cell: ({ cell }) => (
          <RatingComponent
            value={cell.getValue<number>()}
            precision={0.5}
            readonly
          />
        ),
      },
    ];
    const specialized: MRT_ColumnDef<ICourse>[] = [
      {
        accessorKey: 'subject.name',
        header: t('exams.subject'),
      },
      {
        accessorKey: 'rating',
        header: t('instructors.rating'),
        Cell: ({ cell }) => (
          <RatingComponent
            value={cell.getValue<number>()}
            precision={0.5}
            readonly
          />
        ),
      },
    ];
    if (isUniversity || isUniversitySubject) return [...common, ...university];
    if (isSchool || isSchoolSubject) return [...common, ...school];
    return [...common, ...specialized];
  }, [t]);

  const CoursesTable = GenericTablePage<ICourse>;

  return (
    <CoursesTable
      form={undefined}
      data={courses?.data || []}
      columns={columns}
      name={String(t('courses.course'))}
      title={`${String(t('courses.courses'))} ${
        extendedPageTitle?.length ? `/${extendedPageTitle}` : ``
      }`}
      isLoading={isLoadingCourses}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      handleAddClick={handleAddClick}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveCourse}
      handleDetailsClick={(data) => handleCourseDetailsClick(data.id)}
      setOpenActionModal={dispatchResetCrudState}
      detailsTooltip="Course Details"
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={courses?.totalRecords || 0}
      withActionProgress={showActionProgress}
      permissionName="forceAllow"
      extra={
        isUniversity ? (
          <Grid container gap={2}>
            <FilterAutoComplete
              defaultValue={universityId?.id || 0}
              onChange={(v) => setUniversityId(v)}
              value={universityId}
              label={String(t('universities.universities'))}
              options={universities?.data ?? []}
            />
            <FilterAutoComplete
              defaultValue={collegeId?.id || 0}
              onChange={(v) => setCollegeId(v)}
              value={collegeId}
              label={String(t('universities.colleges'))}
              options={colleges?.data ?? []}
              disabled={!universityId?.id}
            />
            <FilterAutoComplete
              defaultValue={collegeDetailsSubjectId?.id || 0}
              onChange={(v) => setCollegeDetailsSubjectId(v)}
              value={collegeDetailsSubjectId}
              label={String(t('exams.subject'))}
              options={
                collegeSubjectDetails?.data
                  .flatMap((d) => d.subjects)
                  .map((d) => ({
                    id: d.id,
                    name: d.name,
                  })) || []
              }
            />
            <FilterAutoComplete
              defaultValue={instructor?.id || 0}
              onChange={(v) => setInstructor(v)}
              value={instructor}
              label={String(t('common.instructors'))}
              options={
                instructors?.data?.map((i) => ({
                  id: i?.id,
                  name: i?.fullName,
                })) || []
              }
            />
            <FilterString query={query} setQuery={setQuery} />
          </Grid>
        ) : isSchool ? (
          <Grid container gap={2}>
            <FilterAutoComplete
              defaultValue={gradeId?.id || 0}
              onChange={(v) => setGradeId(v)}
              value={gradeId}
              label={String(t('grades.grades'))}
              options={grades?.data ?? []}
            />
            <FilterAutoComplete
              defaultValue={gradeSubjectId?.id || 0}
              onChange={(v) => setGradeSubjectId(v)}
              value={gradeSubjectId}
              label={String(t('exams.subject'))}
              options={
                gradeSubjects?.data.map((gradeSubject) => ({
                  id: gradeSubject.id,
                  name: gradeSubject.subject.name,
                })) || []
              }
            />
            <FilterAutoComplete
              defaultValue={instructor?.id || 0}
              onChange={(v) => setInstructor(v)}
              value={instructor}
              label={String(t('common.instructors'))}
              options={
                instructors?.data?.map((i) => ({
                  id: i?.id,
                  name: i?.fullName,
                })) || []
              }
            />
            <FilterString query={query} setQuery={setQuery} />
          </Grid>
        ) : isSpecialized ? (
          <Grid container gap={2}>
            <FilterAutoComplete
              defaultValue={specializedId?.id || 0}
              onChange={(v) => setSpecializedId(v)}
              value={specializedId}
              label={String(t('specialized.specialized'))}
              options={Specializes?.data ?? []}
            />
            <FilterAutoComplete
              defaultValue={instructor?.id || 0}
              onChange={(v) => setInstructor(v)}
              value={instructor}
              label={String(t('common.instructors'))}
              options={
                instructors?.data?.map((i) => ({
                  id: i?.id,
                  name: i?.fullName,
                })) || []
              }
            />
            <FilterString query={query} setQuery={setQuery} />
          </Grid>
        ) : null
      }
      extraActions={(data) => (
        <Tooltip
          title={data.isPublished ? t('common.unpublish') : t('common.publish')}
        >
          <IconButton
            onClick={() => handlePublish(data, !data.isPublished)}
            color={data.isPublished ? 'error' : 'success'}
          >
            {data.isPublished ? <Unpublished /> : <Publish />}
          </IconButton>
        </Tooltip>
      )}
    />
  );
}

export default ProtectPage({
  Page: CoursesPage,
  internalPathNameSearch: true,
});
