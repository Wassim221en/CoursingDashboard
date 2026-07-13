import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import examApi from './exam.api';
import {
  IExamUserPayload,
  IGetExamQuestionPayload,
  IGetSchoolExamPayload,
  IGetSpecializedExamPayload,
  IGetUniversityExamPayload,
} from './exam.interfaces';

const useUniversityExamsQuery = (
  payload?: IGetUniversityExamPayload & IPaginationParams,
  disabled?: boolean,
) => {
  const queryResult = useQuery(
    ['get-exams', payload],
    () => examApi.getAllUniversityExams(payload),
    {
      enabled: !disabled,
    },
  );
  return queryResult;
};

const useSchoolExamsQuery = (
  payload?: IGetSchoolExamPayload & IPaginationParams,
  disabled?: boolean,
) => {
  const queryResult = useQuery(
    ['get-exams', payload],
    () => examApi.getAllSchoolExams(payload),
    {
      enabled: !disabled,
    },
  );
  return queryResult;
};

const useSpecializedExamsQuery = (
  payload?: IGetSpecializedExamPayload & IPaginationParams,
  disabled?: boolean,
) => {
  const queryResult = useQuery(
    ['get-exams', payload],
    () => examApi.getAllSpecializedExams(payload),
    {
      enabled: !disabled,
    },
  );
  return queryResult;
};

const useExamsQuery = (
  payload?: IGetSpecializedExamPayload & IPaginationParams,
) => {
  const queryResult = useQuery(['get-exams', payload], () =>
    examApi.getAllExams(payload),
  );
  return queryResult;
};

const useExamDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-exam-by-id', id],
    () => examApi.getExamById(id),
    {
      enabled: !!id,
      cacheTime: 0,
    },
  );
  return queryResult;
};

const usePastExamsQuery = () => {
  const queryResult = useQuery(['get-Past-exams'], () =>
    examApi.getAllPastExams(),
  );
  return queryResult;
};

const usePastExamDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-Past-exam-by-id', id],
    () => examApi.getPastExamById(id),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};
const useUserExamsInfiniteQuery = (payload: IExamUserPayload) => {
  const queryResult = useInfiniteQuery(
    ['get-infinite-user-exams', payload],
    async ({ pageParam = 0 }) => {
      const result = await examApi.GetUserExams({
        ...payload,
        pageNumber: pageParam,
      });
      return { data: result, pageParam: pageParam + 1 };
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.data.hasNextPage) return undefined;
        return lastPage.pageParam;
      },
      refetchOnMount: 'always',
    },
  );
  return queryResult;
};

const useQuestionsQuery = (payload?: IGetExamQuestionPayload) => {
  const queryResult = useQuery(['get-Past-exams'], () =>
    examApi.getAllQuestions(payload),
  );
  return queryResult;
};

const useStudentsOrderInExamQuery = (examId?: number) => {
  const queryResult = useQuery(
    ['get-students-order-in-exam', examId],
    () => examApi.getStudentsOrderInExam(examId!),
    {
      enabled: !!examId,
    },
  );
  return queryResult;
};

const useQuestionDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-Past-exam-by-id', id],
    () => examApi.getQuestionById(id),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};

const examQueries = {
  useExamDetailsQuery,
  useExamsQuery,
  usePastExamDetailsQuery,
  usePastExamsQuery,
  useQuestionDetailsQuery,
  useQuestionsQuery,
  useUniversityExamsQuery,
  useSchoolExamsQuery,
  useSpecializedExamsQuery,
  useUserExamsInfiniteQuery,
  useStudentsOrderInExamQuery,
};

export default examQueries;
