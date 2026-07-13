import { Box } from '@mui/material';
import { ICollegeDetails } from 'apis/college-details/college-details.interfaces';
import { ICollegeSubjectDetails } from 'apis/college-subject/college-subject.interfaces';
import React from 'react';
import CollegeDetailsItem from './college-details-item.component';

export type TCollegeDetailsProps = {
  handleEditClick: (data: ICollegeDetails) => void;
  handleRemoveClick: (id: number) => void;
  handleSubjectEditClick: (Props: {
    data: ICollegeSubjectDetails | null;
    collegeDetailsId: number;
  }) => void;
  handleSubjectRemoveClick: (Props: {
    subjectId: number;
    collegeDetailsId: number;
  }) => void;
  collegeId: number;
};

type Props = TCollegeDetailsProps & {
  items: any;
};

function CollegeDetailsList({
  items,
  handleEditClick,
  handleRemoveClick,
  handleSubjectEditClick,
  handleSubjectRemoveClick,
  collegeId,
}: Props) {
  return (
    <Box>
      {items.map((item) => (
        <CollegeDetailsItem
          key={item.id}
          item={item}
          handleEditClick={handleEditClick}
          handleRemoveClick={handleRemoveClick}
          handleSubjectEditClick={handleSubjectEditClick}
          handleSubjectRemoveClick={handleSubjectRemoveClick}
          collegeId={collegeId}
        />
      ))}
    </Box>
  );
}

export default CollegeDetailsList;
