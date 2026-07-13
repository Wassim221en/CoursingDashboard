/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unstable-nested-components */
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { useTranslation } from 'react-i18next';
import { IReport } from 'apis/reports/reports.interfaces';
import reportsQueries from 'apis/reports/reports.queries';
import { generateFriendlyDate, truncateString } from 'utils/helpers';
import FadeModal from 'components/common/generic-table-page/components/fade-modal/fade-modal.component';
import { Box } from '@mui/system';
import { Button, Divider, Typography } from '@mui/material';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useLocation } from 'react-router-dom';
import routesNames from 'routes/constants';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import ReportsApis from 'apis/reports/reports.api';
import { showSuccess } from 'libs/react.toastify';
import { reportSectionType, reportTypes } from 'constants/constants';
import ThemeVariables from 'theme/theme-variables';

function Reports() {
  const { pathname = '' } = useLocation();

  const universityRerports = pathname.includes(routesNames.universityReports);
  const schoolRerports = pathname.includes(routesNames.schoolReports);
  const specializeRerports = pathname.includes(routesNames.specializedReports);
  const instructorsReports = pathname.includes(routesNames.instructorsReports);
  const courseReports =
    pathname.includes(routesNames.schoolCourseDetails) ||
    pathname.includes(routesNames.universityCourseDetails) ||
    pathname.includes(routesNames.specializeCourseDetails);
  const universityExamsReports = pathname.includes(
    routesNames.universityExamsReports,
  );
  const schoolExamsReports = pathname.includes(routesNames.schoolExamsReports);
  const specializeExamsReports = pathname.includes(
    routesNames.specializedExamsReports,
  );

  const universityQuestionsBankReports = pathname.includes(
    routesNames.universityQuestionsBankReports,
  );
  const schoolQuestionsBankReports = pathname.includes(
    routesNames.schoolQuestionsBankReports,
  );
  const specializeQuestionsBankReports = pathname.includes(
    routesNames.specializeQuestionsBankReports,
  );

  const reportSection =
    universityExamsReports || universityRerports
      ? reportSectionType.university
      : schoolExamsReports || schoolRerports
      ? reportSectionType.schooling
      : specializeExamsReports || specializeRerports
      ? reportSectionType.specialty
      : universityQuestionsBankReports
      ? reportSectionType.university
      : schoolQuestionsBankReports
      ? reportSectionType.schooling
      : specializeQuestionsBankReports
      ? reportSectionType.specialty
      : null;

  const reportType =
    universityRerports || schoolRerports || specializeRerports
      ? reportTypes.general
      : courseReports
      ? reportTypes.courseLesson
      : instructorsReports
      ? reportTypes.instructor
      : universityExamsReports || schoolExamsReports || specializeExamsReports
      ? reportTypes.exam
      : universityQuestionsBankReports ||
        schoolQuestionsBankReports ||
        specializeQuestionsBankReports
      ? reportTypes.question
      : '';

  const courseId = useSearchParams('course') || null;

  const { t } = useTranslation();

  const [openReportModal, setOpenReportModal] = useState(false);

  const [reportData, setReportData] = useState<IReport>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: reports,
    isLoading: isLoadingReports,
    refetch,
  } = reportsQueries.useReportsQuery({
    section: reportSection,
    type: reportType,
    courseId: courseId ?? null,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { dispatchDeleting, getActionId, isDeleting, dispatchResetCrudState } =
    useCreateCrudState();

  const handleDetailsClick = useCallback(
    (data: IReport) => {
      setReportData(data);
      setOpenReportModal(true);
    },
    [setReportData],
  );

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting({ actionId: id });
    },
    [dispatchDeleting],
  );

  const handleRemoveReport = async () => {
    try {
      await ReportsApis.removeReport(getActionId(), reportSection!);
      await refetch();
      showSuccess(t('common.dataDeletedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reportQuestionOptions = [
    { id: 1, name: t('reports.scientific-error') },
    { id: 2, name: t('reports.spelling-error') },
    { id: 3, name: t('reports.explain') },
  ];

  const ReportsTable = GenericTablePage<IReport>;

  const columns = useMemo<MRT_ColumnDef<IReport>[]>(
    () => [
      {
        accessorKey: 'student.name',
        header: t('reports.reporterName'),
      },

      {
        accessorKey: 'description',
        header: t('reports.report'),
        Cell: ({ cell }) => truncateString(cell.getValue<string>(), 50),
      },
      {
        accessorKey: 'date',
        header: t('news.date'),
        Cell: ({ cell }) => generateFriendlyDate(cell.getValue<string>()),
      },
    ],
    [t],
  );

  const InstructorColumns = useMemo<MRT_ColumnDef<IReport>[]>(
    () => [
      {
        accessorKey: 'instructor.fullName',
        header: t('reports.reportedInstructor'),
      },
      {
        accessorKey: 'student.name',
        header: t('reports.reporterName'),
      },
      {
        accessorKey: 'description',
        header: t('reports.report'),
        Cell: ({ cell }) => truncateString(cell.getValue<string>(), 50),
      },
      {
        accessorKey: 'course.title',
        header: t('courses.course'),
        // Cell: ({ cell }) => truncateString(cell.getValue<string>(), 50),
      },
      {
        accessorKey: 'date',
        header: t('news.date'),
        Cell: ({ cell }) => generateFriendlyDate(cell.getValue<string>()),
      },
    ],
    [t],
  );

  const ExamsColumns = useMemo<MRT_ColumnDef<IReport>[]>(
    () => [
      {
        accessorKey: 'student.name',
        header: t('reports.reporterName'),
      },
      {
        accessorKey: 'exam.title',
        header: t('exams.exam'),
      },
      {
        accessorKey: 'description',
        header: t('reports.description'),
        Cell: ({ cell }) => truncateString(cell.getValue<string>(), 50),
      },
      {
        accessorKey: 'questionReason',
        header: t('reports.type'),
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()
              ? reportQuestionOptions[cell.getValue<number>() - 1].name
              : ''}
          </Typography>
        ),
      },
      {
        accessorKey: 'date',
        header: t('news.date'),
        Cell: ({ cell }) => generateFriendlyDate(cell.getValue<string>()),
      },
    ],
    [reportQuestionOptions, t],
  );

  const QuestionsColumns = useMemo<MRT_ColumnDef<IReport>[]>(
    () => [
      {
        accessorKey: 'student.name',
        header: t('reports.reporterName'),
      },
      {
        accessorKey: 'course.title',
        header: t('courses.course'),
        Cell: ({ row }) => row.original.course?.title ?? '—',
      },
      {
        accessorKey: 'lesson.title',
        header: t('exams.lesson'),
        Cell: ({ row }) => row.original.lesson?.title ?? '—',
      },
      {
        accessorKey: 'question.title',
        header: t('questionsBank.question'),
      },
      {
        accessorKey: 'description',
        header: t('reports.report'),
        Cell: ({ cell }) => truncateString(cell.getValue<string>(), 50),
      },
      {
        accessorKey: 'questionReason',
        header: t('reports.type'),
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()
              ? reportQuestionOptions[cell.getValue<number>() - 1]?.name
              : ''}
          </Typography>
        ),
      },
      {
        accessorKey: 'date',
        header: t('news.date'),
        Cell: ({ cell }) => generateFriendlyDate(cell.getValue<string>()),
      },
    ],
    [reportQuestionOptions, t],
  );

  const SchoolQuestionsColumns = useMemo<MRT_ColumnDef<IReport>[]>(
    () => [
      {
        accessorKey: 'student.name',
        header: t('reports.reporterName'),
      },
      {
        accessorKey: 'subject',
        header: t('subjects.subject'),
        Cell: ({ row }) =>
          row.original.subject ?? row.original.course?.subject?.name ?? '—',
      },
      {
        accessorKey: 'course.title',
        header: t('courses.course'),
        Cell: ({ row }) => row.original.course?.title ?? '—',
      },
      {
        accessorKey: 'lesson.title',
        header: t('exams.lesson'),
        Cell: ({ row }) => row.original.lesson?.title ?? '—',
      },
      {
        accessorKey: 'question.title',
        header: t('questionsBank.question'),
      },
      {
        accessorKey: 'description',
        header: t('reports.report'),
        Cell: ({ cell }) => truncateString(cell.getValue<string>(), 50),
      },
      {
        accessorKey: 'questionReason',
        header: t('reports.type'),
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()
              ? reportQuestionOptions[cell.getValue<number>() - 1]?.name
              : ''}
          </Typography>
        ),
      },
      {
        accessorKey: 'date',
        header: t('news.date'),
        Cell: ({ cell }) => generateFriendlyDate(cell.getValue<string>()),
      },
    ],
    [reportQuestionOptions, t],
  );

  const Coursecolumns = useMemo<MRT_ColumnDef<IReport>[]>(
    () => [
      {
        accessorKey: 'student.name',
        header: t('reports.reporterName'),
      },
      {
        accessorKey: 'lesson.title',
        header: t('exams.lesson'),
        Cell: ({ row }) => row.original.lesson?.title ?? '—',
      },

      {
        accessorKey: 'description',
        header: t('reports.report'),
        Cell: ({ cell }) => truncateString(cell.getValue<string>(), 50),
      },

      {
        accessorKey: 'date',
        header: t('news.date'),
        Cell: ({ cell }) => generateFriendlyDate(cell.getValue<string>()),
      },
    ],
    [t],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      if (!reportType) return;
      await ReportsApis.markAllReportsAsRead(courseId ?? undefined, reportType);
      showSuccess(t('common.dataUpdatedSuccessfully'));
      refetch();
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [t, courseId, reportType, refetch]);

  const tableColumns = instructorsReports
    ? InstructorColumns
    : universityExamsReports || schoolExamsReports || specializeExamsReports
    ? ExamsColumns
    : schoolQuestionsBankReports
    ? SchoolQuestionsColumns
    : universityQuestionsBankReports || specializeQuestionsBankReports
    ? QuestionsColumns
    : courseReports
    ? Coursecolumns
    : columns;

  return (
    <>
      <ReportsTable
        form=""
        data={reports?.data || []}
        columns={tableColumns}
        title={t('reports.reports')}
        isLoading={isLoadingReports}
        detailsTooltip="Show Details"
        handleDetailsClick={handleDetailsClick}
        setPagination={setPagination}
        pagination={pagination}
        totalRecords={reports?.totalRecords || 0}
        openDeleteModal={isDeleting}
        setOpenDeleteModal={dispatchResetCrudState}
        handleRemoveClick={handleRemoveClick}
        handleDeleteSubmit={handleRemoveReport}
        withActionProgress={false}
        permissionName="forceAllow"
        extraButtons={
          <Button onClick={handleMarkAllAsRead}>
            {t('common.markAllAsRead')}
          </Button>
        }
        tableProps={{
          muiTableBodyRowProps: ({ row: { original } }) => ({
            sx: {
              backgroundColor: !original.isReadFromDashboard
                ? '#f5f5f5'
                : '#fff',
              '& td': {
                color: !original.isReadFromDashboard
                  ? ThemeVariables.PRIMARY_COLOR
                  : undefined,
              },
            },
          }),
        }}
      />
      <FadeModal
        width={900}
        open={!!openReportModal}
        setOpen={setOpenReportModal}
        isDialog
      >
        <Box>
          <Box display="flex">
            <Typography fontWeight={600}>{t('reports.fromUser')}</Typography>
            <Typography px={1}>{reportData?.student?.name}</Typography>
          </Box>
          <Divider sx={{ paddingTop: 3 }} />

          <Box pt={4}>
            <Typography fontWeight={600}>{t('reports.report')}</Typography>
            <Typography>{reportData?.description}</Typography>
          </Box>
          <Divider sx={{ paddingTop: 5 }} />
          <Box pt={3}>
            <Typography fontWeight={600}>{t('reports.choices')}</Typography>
            {reportData?.question &&
              reportData?.question.choices?.map((c) => (
                <Typography
                  sx={{
                    backgroundColor: c.theTrueAnswer ? 'green' : 'red',
                    opacity: 0.8,
                    width: 'fit-content',
                    color: 'white',
                    my: 1,
                    p: 1,
                    borderRadius: '10px',
                  }}
                  key={c.title}
                  fontWeight={500}
                >
                  {c.title}
                </Typography>
              ))}
          </Box>
          <Typography fontWeight={500}>
            {generateFriendlyDate(reportData?.date!)}
          </Typography>
        </Box>
      </FadeModal>
    </>
  );
}

export default Reports;
