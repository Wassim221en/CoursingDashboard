/* eslint-disable no-console */
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
} from '@mui/material';
import { ICourse } from 'apis/course/course.interfaces';
import { generateFriendlyDate } from 'utils/helpers';
import { useTranslation } from 'react-i18next';

type Props = {
  item: ICourse;
};

function StudentCoursesCard({ item }: Props) {
  const { t } = useTranslation();
  const { title, coverUrl = '', completionRate, enrollDate } = item;

  return (
    <Card>
      <CardMedia
        sx={{
          aspectRatio: '1 / 1',
        }}
        component="img"
        image={coverUrl || '/assets/images/book.png'}
        alt={`${title} cover`}
      />
      <CardContent>
        <Box>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Typography gutterBottom component="div">
            {t('courses.enrollDate')}
          </Typography>
          <Typography gutterBottom component="div" px={1}>
            {generateFriendlyDate(enrollDate)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', pt: 1 }}>
          <Typography gutterBottom component="div" pt={1}>
            {t('courses.progressPercent')}
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex', px: 1 }}>
            <CircularProgress
              variant="determinate"
              value={completionRate}
              size={43}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
                fontWeight={600}
                fontSize={12}
              >
                {`${completionRate} % `}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StudentCoursesCard;
