import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import QuestionApi from './questions.api';
import { IExamQuestionPayload } from './questions.interfaces';

const useQuestionQuery = (
  payload: IExamQuestionPayload & IPaginationParams,
  disabled?: boolean,
) => {
  const queryResult = useQuery(
    ['get-Question', payload],
    () => QuestionApi.getAllQuestions(payload),
    {
      enabled: !!disabled,
    },
  );
  return queryResult;
};

const useQuestionByIdQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-Question-by-id', id],
    () => QuestionApi.getQuestionById(id),
    {
      enabled: !!id,
      cacheTime: 0,
    },
  );
  return queryResult;
};

const QuestionQueries = {
  useQuestionQuery,
  useQuestionByIdQuery,
};

export default QuestionQueries;
