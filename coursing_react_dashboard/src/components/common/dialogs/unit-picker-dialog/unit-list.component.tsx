import { ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  IconButton,
  List,
  MenuItem,
  Typography,
} from '@mui/material';
import { TCourseUnit } from 'apis/course/course.interfaces';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function UnitList({
  units,
  onChange,
}: {
  units?: TCourseUnit[];
  onChange?: (unit: TCourseUnit) => void;
}) {
  const { t } = useTranslation();
  const [openUnit, setOpenUnit] = useState<number>();
  const noData = !units || units.length === 0;
  return (
    <List sx={{ padding: 0 }}>
      {noData && <Typography variant="h5">{t('lessons.no-units')}</Typography>}
      {units?.map((unit, idx) => (
        <Box key={unit.id}>
          <MenuItem
            sx={{ height: '2.5rem' }}
            onClick={(e) => {
              e.stopPropagation();
              onChange?.(unit);
            }}
          >
            {Array.isArray(unit.children) && unit.children.length > 0 && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenUnit((prev) => (prev === idx ? undefined : idx));
                }}
              >
                <ExpandMore
                  sx={{
                    transition: 'all ease 150ms',
                    rotate: idx === openUnit ? '180deg' : '0deg',
                  }}
                />
              </IconButton>
            )}
            <Typography>{unit.title}</Typography>
          </MenuItem>
          {Array.isArray(unit.children) && unit.children.length > 0 && (
            <Collapse sx={{ width: '100%' }} in={idx === openUnit}>
              <UnitList units={unit.children} onChange={onChange} />
            </Collapse>
          )}
        </Box>
      ))}
    </List>
  );
}

export default UnitList;
