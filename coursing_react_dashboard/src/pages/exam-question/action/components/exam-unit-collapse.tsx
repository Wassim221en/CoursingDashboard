import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import NoData from 'components/common/no-data/no-data.component';
import React from 'react';
import { TExamUnitState, TQuestionState } from '../action';
import QusetionCard from './qusetionCard';

type Props = {
  unit: TExamUnitState;
  handleStageQuestion: (question: TQuestionState) => void;
};

function ExamUnitCollapse({ unit, handleStageQuestion }: Props) {
  return (
    <Accordion key={unit.id} sx={{ mt: 2 }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel2a-content"
        id="panel2a-header"
      >
        <Typography textAlign="center"> {unit.title}</Typography>
      </AccordionSummary>
      {unit.children.map((u) => (
        <ExamUnitCollapse
          key={u.id}
          unit={u}
          handleStageQuestion={handleStageQuestion}
        />
      ))}
      <AccordionDetails>
        {unit?.questions?.length ? (
          unit.questions.map((q) => (
            <QusetionCard
              key={q.questionId}
              onClick={() => handleStageQuestion({ ...q, unitId: unit.id })}
              question={q}
            />
          ))
        ) : (
          <NoData text="no questions for this unit" height="120px" />
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default ExamUnitCollapse;
