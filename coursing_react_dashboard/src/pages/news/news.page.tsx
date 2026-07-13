/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import { showSuccess } from 'libs/react.toastify';
import {
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  INews,
  INewsPayload,
  INewsPayloadForm,
} from 'apis/news/news.interfaces';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { MRT_ColumnDef } from 'material-react-table';
import newsQueries from 'apis/news/news.queries';
import newsApis from 'apis/news/news.api';
import prepareNewsFormData from 'components/forms/news/helper/perpare-news-formdata';
import NewsForm from 'components/forms/news/news.form';
import {
  convertUtcDateToLocaleDate,
  generateFriendlyDateAndTime,
  sanitizeHtml,
  truncateString,
} from 'utils/helpers';
import { useLocation } from 'react-router-dom';
import routesNames from 'routes/constants';
import ProtectPage from 'components/common/protect-page/protectPage';
import useDebounce from 'hooks/use-debounce/useDebounce';
import FilterString from 'components/common/filter-string/filter-string.component';
import CellImage from 'components/common/cell-image/cell-image.component';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import universityQueries from 'apis/university/university.queries';
import collegeQueries from 'apis/college/college.queries';
import collegeDetailsQueries from 'apis/college-details/college-details.queries';
import gradeQueries from 'apis/grade/grade.queries';
import specializedQueries from 'apis/specialized/specialized.queries';
import FilterAutoComplete from 'components/common/filter-auto-complete/filter-auto-complete.component';
import { Grid } from '@mui/material';
import { newsStudentType } from 'constants/constants';

function NewsPage() {
  const {
    dispatchAdding,
    dispatchDeleting,
    dispatchResetCrudState,
    dispatchEditing,
    isDeleting,
    getActionId,
    getSelectedData,
    isAdding,
    isEditing,
  } = useCreateCrudState<INews>();

  const { pathname = '' } = useLocation();
  const universityNews = pathname.includes(routesNames.universityNews);

  const schoolNews = pathname.includes(routesNames.schoolNews);

  const specializeNews = pathname.includes(routesNames.specializeNews);

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

  const { t } = useTranslation();

  const [showActionProgress, setShowActionProgress] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  // filters States
  const [query, setQuery] = useState('');

  const [progress, setProgress] = useState<number>();

  const abortHandler = useRef<any>();

  const queryString = useDebounce(query, 500);

  const {
    data: news,
    refetch,
    isLoading: isLoadingNews,
  } = newsQueries.useNewsQuery({
    text: queryString,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
    collegeId: collegeId?.id,
    collegeDetailsSubjectId: universityNews
      ? collegeDetailsSubjectId?.id || 0
      : null,
    gradeSubjectId: schoolNews ? gradeSubjectId?.id || 0 : null,
    specializedId: specializeNews ? specializedId?.id || 0 : null,
  });

  // university queries
  const { data: universities } = universityQueries.useUniversitiesQuery(
    {},
    !universityNews,
  );
  const { data: colleges } = collegeQueries.useCollegesQuery(
    { universityId: universityId?.id },
    !universityNews,
  );

  const { data: collegeSubjectDetails } =
    collegeDetailsQueries.useGetAllCollegeDetailsQuery({
      collegeId: collegeId?.id || 0,
    });

  // school queries

  const { data: grades } = gradeQueries.useGradesQuery({}, !schoolNews);

  const { data: gradeSubjects } = gradeQueries.useGradeSubjectsQuery(
    { gradeId: gradeId?.id },

    !gradeId?.id,
  );

  // specialized queries

  const { data: Specializes } = specializedQueries.useSpecializedQuery(
    !specializeNews,
  );

  const handleEditClick = useCallback(
    (data: INews) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleRemoveClick = useCallback(
    (instructorId: number) => {
      dispatchDeleting(instructorId);
    },
    [dispatchDeleting],
  );

  const handleRemoveNews = async () => {
    setShowActionProgress(true);
    try {
      await newsApis.removeNews(getActionId());
      await refetch();
      setShowActionProgress(false);
      dispatchResetCrudState();
      showSuccess(t('common.dataDeletedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowActionProgress(false);
    }
  };

  const handleNewsAction = async (
    onProgress: (p?: number) => void,
    abortHandlerRef: MutableRefObject<any>,
    { data, files, urlsForRemove }: TSubmitHandlerData<INewsPayloadForm>,
  ) => {
    try {
      if (getSelectedData()?.id) {
        const formPayload: INewsPayload = {
          ...data,
          id: getSelectedData()?.id,
          collegeId: data?.collegeId?.id || null,
          collegeDetailsSubjectId:
            universityNews && data?.collegeId?.id
              ? data?.collegeDetailsSubjectId?.id || null
              : null,
          collegeSubjectId:
            universityNews && !data?.collegeId?.id
              ? data?.collegeSubjectId?.id || null
              : null,
          gradeSubjectId:
            schoolNews && data?.GradeId?.id
              ? data?.gradeSubjectId?.id || null
              : null,
          schoolSubjectId:
            schoolNews && !data?.GradeId?.id
              ? data?.schoolSubjectId?.id || null
              : null,
          GradeId: data?.GradeId?.id || null,
          specializedId: data?.specializedId || null,
          gradeId: data?.GradeId?.id || null,
          date: new Date(data.date).toISOString(),
          Type: universityNews
            ? newsStudentType.collegeStudent
            : schoolNews
            ? newsStudentType.schoolStudent
            : specializeNews
            ? newsStudentType.specialityStudent
            : null,
        };

        const payload = prepareNewsFormData({
          data: formPayload,
          files,
          urlsForRemove,
        });
        await newsApis.updateNews(payload, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const formPayload: INewsPayload = {
          ...data,
          collegeId: data?.collegeId?.id || null,
          collegeDetailsSubjectId:
            universityNews && data?.collegeId?.id
              ? data?.collegeDetailsSubjectId?.id || null
              : null,
          collegeSubjectId:
            universityNews && !data?.collegeId?.id
              ? data?.collegeSubjectId?.id || null
              : null,
          gradeSubjectId:
            schoolNews && data?.GradeId?.id
              ? data?.gradeSubjectId?.id || null
              : null,
          schoolSubjectId:
            schoolNews && !data?.GradeId?.id
              ? data?.schoolSubjectId?.id || null
              : null,
          GradeId: data?.GradeId?.id || null,
          gradeId: data?.GradeId?.id || null,
          specializedId: data?.specializedId || null,
          date: new Date(data.date).toISOString(),
          Type: universityNews
            ? newsStudentType.collegeStudent
            : schoolNews
            ? newsStudentType.schoolStudent
            : specializeNews
            ? newsStudentType.specialityStudent
            : null,
        };

        const payload = prepareNewsFormData({
          data: formPayload,
          files,
        });
        await newsApis.addNews(payload, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  const NewsTable = GenericTablePage<INews>;

  const universityColumns = useMemo<MRT_ColumnDef<INews>[]>(
    () => [
      {
        accessorKey: 'imageUrl',
        header: t('common.image'),
        Cell: ({ cell }) => <CellImage imageSrc={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'title',
        header: t('news.title'),
      },
      {
        accessorKey: 'content',
        header: t('news.content'),
        Cell: ({ cell }) =>
          truncateString(sanitizeHtml(cell.getValue<string>()), 50),
      },
      {
        accessorKey: 'college.name',
        header: t('universities.college'),
      },
      {
        id: 'universitySubject',
        header: t('subjects.subject'),
        Cell: ({ row }) =>
          row.original.collegeDetailsSubject?.name ??
          row.original.collegeSubject?.name ??
          '',
      },
      {
        accessorKey: 'date',
        header: t('news.date'),
        Cell: ({ cell }) =>
          generateFriendlyDateAndTime(cell.getValue<string>()),
      },
    ],
    [t],
  );

  const schoolColumns = useMemo<MRT_ColumnDef<INews>[]>(
    () => [
      {
        accessorKey: 'imageUrl',
        header: t('common.image'),
        Cell: ({ cell }) => <CellImage imageSrc={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'title',
        header: t('news.title'),
      },
      {
        accessorKey: 'content',
        header: t('news.content'),
        Cell: ({ cell }) =>
          truncateString(sanitizeHtml(cell.getValue<string>()), 50),
      },
      {
        id: 'schoolGradeCol',
        header: t('grades.grade'),
        Cell: ({ row }) =>
          row.original.grade?.name ??
          row.original.gradeSubject?.grade?.name ??
          (row.original.schoolSubject ? '—' : ''),
      },
      {
        id: 'schoolSubjectCol',
        header: t('subjects.subject'),
        Cell: ({ row }) =>
          row.original.gradeSubject?.subject?.name ??
          row.original.schoolSubject?.name ??
          '',
      },
      {
        accessorKey: 'date',
        header: t('news.date'),
        Cell: ({ cell }) => convertUtcDateToLocaleDate(cell.getValue<string>()),
      },
    ],
    [t],
  );

  const specializedColumns = useMemo<MRT_ColumnDef<INews>[]>(
    () => [
      {
        accessorKey: 'imageUrl',
        header: t('common.image'),
        Cell: ({ cell }) => <CellImage imageSrc={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'title',
        header: t('news.title'),
      },
      {
        accessorKey: 'content',
        header: t('news.content'),
        Cell: ({ cell }) =>
          truncateString(sanitizeHtml(cell.getValue<string>()), 50),
      },
      {
        accessorKey: 'specialized.name',
        header: t('specialized.specialized'),
      },

      {
        accessorKey: 'date',
        header: t('news.date'),
        Cell: ({ cell }) =>
          generateFriendlyDateAndTime(cell.getValue<string>()),
      },
    ],
    [t],
  );

  const columns = universityNews
    ? universityColumns
    : schoolNews
    ? schoolColumns
    : specializedColumns;

  return (
    <NewsTable
      form={
        <NewsForm
          onSubmit={(data) => handleNewsAction(setProgress, abortHandler, data)}
          onAbortClick={abortHandler.current}
          progress={progress}
          editItem={getSelectedData()}
        />
      }
      data={news?.data || []}
      columns={columns}
      name={String(t('news.addNews'))}
      title={t('news.news')}
      isLoading={isLoadingNews}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveNews}
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      actionModalTitle={
        isEditing ? String(t('news.editNews')) : String(t('news.addNews'))
      }
      detailsTooltip="Show details"
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={news?.totalRecords || 0}
      withActionProgress={showActionProgress}
      width={800}
      permissionName={
        universityNews
          ? 'UniversityNews'
          : schoolNews
          ? 'SchoolingNews'
          : 'SpecialtyNews'
      }
      extra={
        universityNews ? (
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

            <FilterString query={query} setQuery={setQuery} />
          </Grid>
        ) : schoolNews ? (
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

            <FilterString query={query} setQuery={setQuery} />
          </Grid>
        ) : specializeNews ? (
          <Grid container gap={2}>
            <FilterAutoComplete
              defaultValue={specializedId?.id || 0}
              onChange={(v) => setSpecializedId(v)}
              value={specializedId}
              label={String(t('specialized.specialized'))}
              options={Specializes?.data ?? []}
            />

            <FilterString query={query} setQuery={setQuery} />
          </Grid>
        ) : null
      }
    />
  );
}

export default ProtectPage({
  Page: NewsPage,
  internalPathNameSearch: true,
});
