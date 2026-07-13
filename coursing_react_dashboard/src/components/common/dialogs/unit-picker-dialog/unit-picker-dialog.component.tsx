import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import courseQueries from 'apis/course/course.queries';
import { TCourseUnit } from 'apis/course/course.interfaces';
import { useTranslation } from 'react-i18next';
import UnitList from './unit-list.component';

interface IProps {
  courseId?: number;
  onClose?: (unit?: TCourseUnit) => void;
}

function UnitPickerDialog({ courseId, onClose }: IProps) {
  const { data, isLoading } = courseQueries.useCourseUnitsQuery({ courseId });
  const { t } = useTranslation();
  return (
    <Dialog open={!!courseId} onClose={() => onClose?.()}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: -2 }}>
          {t('lessons.pick-unit')}
        </Typography>
        <IconButton onClick={() => onClose?.()}>
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {isLoading &&
          Array(5)
            .fill(0)
            .map((idx) => (
              <Skeleton
                key={idx}
                sx={{
                  height: '4rem',
                  width: '20rem',
                }}
              />
            ))}
        <UnitList units={data} onChange={onClose} />
      </DialogContent>
    </Dialog>
  );
}

export default UnitPickerDialog;
