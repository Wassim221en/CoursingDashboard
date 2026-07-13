import { Box, SxProps, Typography } from '@mui/material';
import { ICollegeSubjectDetails } from 'apis/college-subject/college-subject.interfaces';
import ActionCellButtons from 'components/common/action-cell-buttons/action-cell-buttons.component';
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import routesNames from 'routes/constants';
import {
  getImageServerLink,
  sanitizeHtml,
  truncateString,
} from 'utils/helpers';

const CARD: SxProps = {
  boxShadow:
    'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px',
  borderRadius: 1,
  position: 'relative',
  transition: 'all 500ms',
  '&:hover .x': { opacity: 1 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // justifyContent: "center",
};
const CARD_CONTENT: SxProps = {
  bgcolor: '#eef2ffd6',
  borderRadius: 1,
  width: '90%',
  mt: -3,
  mb: 2,
};
const ACTION_BUTTON: SxProps = {
  bgcolor: 'rgb(0 0 0 / 23%)',
  borderRadius: 1,
  flexDirection: 'column',
  right: 0,
  position: 'absolute',
};

type Props = {
  item: ICollegeSubjectDetails;
  handleSubjectEditClick: (Props: {
    data: ICollegeSubjectDetails | null;
    collegeDetailsId: number;
  }) => void;
  handleSubjectRemoveClick: (Props: {
    subjectId: number;
    collegeDetailsId: number;
  }) => void;
  collegeDetailsId: number;
  collegeId: number;
};

function SubjectCard({
  handleSubjectRemoveClick,
  handleSubjectEditClick,
  item,
  collegeDetailsId,
  collegeId,
}: Props) {
  return (
    <Box sx={CARD}>
      <Box className="x" sx={{ opacity: 0, transition: 'all 600ms' }}>
        <Box sx={ACTION_BUTTON}>
          <ActionCellButtons
            data={null}
            permissionName="College"
            handleEditClick={() =>
              handleSubjectEditClick!({ data: item, collegeDetailsId })
            }
            handleRemoveClick={() =>
              handleSubjectRemoveClick!({
                subjectId: item.id,
                collegeDetailsId,
              })
            }
          />
        </Box>
      </Box>
      <Link
        to={`${routesNames.collegeSubjectsDetails}?collegeId=${collegeId}&subject=${item.id}`}
      >
        <LazyLoadImage
          src={getImageServerLink(item?.filesUrls[0] ?? '')}
          style={{
            borderRadius: 4,
            width: '100%',
            aspectRatio: '16 / 9',
          }}
        />
      </Link>
      <Box sx={CARD_CONTENT}>
        <Typography
          sx={{ borderBottom: '1px solid blue', textAlign: 'center' }}
          fontWeight={600}
          fontSize={20}
          p={1}
        >
          {item.name}
        </Typography>
        <Typography
          sx={{ mt: 1, fontStyle: 'italic', textAlign: 'center' }}
          fontSize={14}
          fontWeight={500}
          p={1}
        >
          {truncateString(sanitizeHtml(item?.description || ''), 100)}
        </Typography>
      </Box>
    </Box>
  );
}

export default SubjectCard;
