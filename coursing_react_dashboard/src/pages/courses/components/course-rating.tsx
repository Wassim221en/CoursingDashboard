/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import courseQueries from 'apis/course/course.queries';
import { IRatingsDetails } from 'apis/course/course.interfaces';
import RatingComponent from 'layout/components/rating-component/rating-component.component';

function CourseRating() {
  const { t } = useTranslation();

  const courseId = useSearchParams('course');

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: courseRating, isLoading: isLoadingCourseRating } =
    courseQueries.useCourseRatingQuery({
      courseId,
      pageNumber: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });

  const Columns = useMemo<MRT_ColumnDef<IRatingsDetails>[]>(
    () => [
      {
        accessorKey: 'studentName',
        header: t('common.fullName'),
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

  const CourseRatingTable = GenericTablePage<IRatingsDetails>;

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
        <Box sx={{}}>
          <Typography
            sx={{ borderBottom: 2, borderColor: 'blue', paddingBottom: 1 }}
          >
            {t('courses.enrolledStudentsCount')}
          </Typography>
          <Typography pt={1} fontSize={20}>
            {courseRating?.studentCourseCount || 0}
          </Typography>
        </Box>
        <Box sx={{}}>
          <Typography
            sx={{ borderBottom: 2, borderColor: 'blue', paddingBottom: 1 }}
          >
            {t('courses.ratersCount')}
          </Typography>
          <Typography pt={1} fontSize={20}>
            {courseRating?.ratingCount || 0}
          </Typography>
        </Box>

        <Box sx={{}}>
          <Typography
            sx={{ borderBottom: 2, borderColor: 'blue', paddingBottom: 1 }}
          >
            {t('courses.ratingAvg')}
          </Typography>
          <Typography pt={1} fontSize={20}>
            {`${courseRating?.ratingAverage || 0}/5`}
          </Typography>
        </Box>
      </Box>
      <Box>
        <CourseRatingTable
          form=""
          columns={Columns}
          data={courseRating?.ratingsDetails.data || []}
          name={String(t('courses.courseRating'))}
          title={String(t('courses.courseRating'))}
          isLoading={isLoadingCourseRating}
          withActionProgress={false}
          pagination={pagination}
          setPagination={setPagination}
          totalRecords={courseRating?.ratingsDetails.totalRecords}
          withoutActions
          permissionName="forceAllow"
        />
      </Box>
    </Box>
  );
}

export default CourseRating;
