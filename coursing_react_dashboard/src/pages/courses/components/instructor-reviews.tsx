/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import courseQueries from 'apis/course/course.queries';
import { IInstructorRatingDetails } from 'apis/course/course.interfaces';
import RatingComponent from 'layout/components/rating-component/rating-component.component';

function InstructorReviews() {
  const { t } = useTranslation();

  const courseId = useSearchParams('course');

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: instructorRating, isLoading: isLoadingInstructorRating } =
    courseQueries.useInstructorCourseRatingQuery({
      courseId,
      pageNumber: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });

  const Columns = useMemo<MRT_ColumnDef<IInstructorRatingDetails>[]>(
    () => [
      {
        accessorKey: 'studentName',
        header: t('common.fullName'),
      },
      {
        accessorKey: 'instructorName',
        header: t('common.instructor'),
      },
      {
        accessorKey: 'rateDescription',
        header: t('lessons.description'),
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
    ],
    [t],
  );

  const InstructorRatingTable = GenericTablePage<IInstructorRatingDetails>;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 7,
          textAlign: 'center',
        }}
      >
        <Box>
          <Typography
            sx={{ borderBottom: 2, borderColor: 'blue', paddingBottom: 1 }}
          >
            {t('courses.enrolledStudentsCount')}
          </Typography>
          <Typography pt={1} fontSize={20}>
            {instructorRating?.studentCourseCount || 0}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{ borderBottom: 2, borderColor: 'blue', paddingBottom: 1 }}
          >
            {t('courses.ratersCount')}
          </Typography>
          <Typography pt={1} fontSize={20}>
            {instructorRating?.ratingCount || 0}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{ borderBottom: 2, borderColor: 'blue', paddingBottom: 1 }}
          >
            {t('courses.ratingAvg')}
          </Typography>
          <Typography pt={1} fontSize={20}>
            {`${instructorRating?.ratingAverage || 0}/5`}
          </Typography>
        </Box>
      </Box>
      <Box>
        <InstructorRatingTable
          form=""
          columns={Columns}
          data={instructorRating?.ratingsDetails?.data || []}
          name={String(t('courses.instructorReviews'))}
          title={String(t('courses.instructorReviews'))}
          isLoading={isLoadingInstructorRating}
          withActionProgress={false}
          pagination={pagination}
          setPagination={setPagination}
          totalRecords={instructorRating?.ratingsDetails?.totalRecords}
          withoutActions
          permissionName="forceAllow"
        />
      </Box>
    </Box>
  );
}

export default InstructorReviews;
