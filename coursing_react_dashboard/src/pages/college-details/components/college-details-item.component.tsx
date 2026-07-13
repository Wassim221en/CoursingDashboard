/* eslint-disable react/no-array-index-key */
import { Box, Container, Grid, Typography } from '@mui/material';
import { ICollegeDetails } from 'apis/college-details/college-details.interfaces';
import { Years } from 'constants/constants';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import React from 'react';
import AddCard from 'components/common/add-card/add-card.component';
import ActionCellButtons from 'components/common/action-cell-buttons/action-cell-buttons.component';
import { useTranslation } from 'react-i18next';
import SubjectCard from './subject-card.components';
import { TCollegeDetailsProps } from './college-details-list.component';

type Props = TCollegeDetailsProps & {
  item: ICollegeDetails;
  collegeId: number;
};

function CollegeDetailsItem({
  item,
  handleEditClick,
  handleRemoveClick,
  handleSubjectEditClick,
  handleSubjectRemoveClick,
  collegeId,
}: Props) {
  const { t } = useTranslation();
  const { semester, subjects, year, id, collegeSection } = item;
  const yearName = Years.find((y) => y.id === year)?.name || '';

  return (
    <Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
      >
        <Box display="flex" gap={0.5} alignItems="center">
          <PlayArrowIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography fontSize={20} fontWeight={500}>
            {t(yearName)} :
          </Typography>
          <Typography fontSize={20} fontWeight={500}>
            {semester.name}
          </Typography>
          <Typography fontSize={20} fontWeight={500}>
            {collegeSection?.name && `:${collegeSection?.name}`}
          </Typography>
        </Box>
        <Box>
          <ActionCellButtons
            data={null}
            handleEditClick={() => handleEditClick(item)}
            handleRemoveClick={() => handleRemoveClick(id)}
            permissionName="College"
          />
        </Box>
      </Box>
      <Container sx={{ my: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} lg={3}>
            <AddCard
              onClick={() =>
                handleSubjectEditClick({ data: null, collegeDetailsId: id })
              }
              title={t('common.addSubjectForYear').toString()}
            />
          </Grid>
          {subjects.map((subject, index) => (
            <Grid item xs={12} sm={4} lg={3} key={subject.id + id + index}>
              <SubjectCard
                collegeDetailsId={id}
                item={subject}
                handleSubjectEditClick={handleSubjectEditClick}
                handleSubjectRemoveClick={handleSubjectRemoveClick}
                collegeId={collegeId}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default CollegeDetailsItem;
