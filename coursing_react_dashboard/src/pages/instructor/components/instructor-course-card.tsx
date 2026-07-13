import { Box, Grid, Typography } from '@mui/material';
import { ICourse } from 'apis/course/course.interfaces';
import { useTranslation } from 'react-i18next';

type Props = {
  instructorCourse: ICourse;
};

function InstructorCourseCard({ instructorCourse }: Props) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        bgcolor: '#2c76dd',
        borderRadius: 5,
        p: 1,
        color: 'white',
        minHeight: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography>{t('courses.course')}:</Typography>
        <Typography
          sx={{
            bgcolor: '#2c76dd',
            borderRadius: 5,
            p: 1,
            color: 'white',
          }}
        >
          {instructorCourse.title}
        </Typography>
      </Box>

      {instructorCourse?.subject?.college && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{t('universities.college')}:</Typography>
            <Typography
              sx={{
                bgcolor: '#2c76dd',
                borderRadius: 5,
                p: 1,
                color: 'white',
              }}
            >
              {instructorCourse?.subject?.college?.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{t('college-details-form.year')}:</Typography>
            <Typography
              sx={{
                bgcolor: '#2c76dd',
                borderRadius: 5,
                p: 1,
                color: 'white',
              }}
            >
              {instructorCourse?.subject?.year}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{t('exams.subject')}:</Typography>
            <Typography
              sx={{
                bgcolor: '#2c76dd',
                borderRadius: 5,
                p: 1,
                color: 'white',
              }}
            >
              {instructorCourse?.subject?.name}
            </Typography>
          </Box>
        </Box>
      )}
      {instructorCourse?.subject?.grade && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{t('grades.grade')}:</Typography>
            <Typography
              sx={{
                bgcolor: '#2c76dd',
                borderRadius: 5,
                p: 1,
                color: 'white',
              }}
            >
              {instructorCourse?.subject?.grade.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{t('exams.subject')}:</Typography>
            <Typography
              sx={{
                bgcolor: '#2c76dd',
                borderRadius: 5,
                p: 1,
                color: 'white',
              }}
            >
              {instructorCourse?.subject?.name}
            </Typography>
          </Box>
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography>{t('courses.courseRating')}:</Typography>
        <Typography
          sx={{
            bgcolor: '#2c76dd',
            borderRadius: 5,
            p: 1,
            color: 'white',
          }}
        >
          {instructorCourse?.rating}
        </Typography>
      </Box>
    </Box>
  );
}

export default InstructorCourseCard;
