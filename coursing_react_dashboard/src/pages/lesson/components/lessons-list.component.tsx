import React from 'react';
import { Grid } from '@mui/material';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import LessonCard from './lesson-card.component';

type Props = {
  lessons: ILesson[];
  handleEditClick: (data: ILesson) => void;
  // handleDetailsClick: (id: number) => void;
  handleRemoveClick: (id: number) => void;
  handleAddClick: (id: number) => void;
};

function LessonsList({
  lessons,
  // handleDetailsClick,
  handleEditClick,
  handleRemoveClick,
  handleAddClick,
}: Props) {
  return (
    <Grid container spacing={2}>
      {lessons.map((lesson) => (
        <Grid item md={4} key={lesson.id}>
          <LessonCard
            handleEditClick={handleEditClick}
            // handleDetailsClick={handleDetailsClick}
            handleRemoveClick={handleRemoveClick}
            handleAddClick={handleAddClick}
            item={lesson}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default LessonsList;
