import { useQuery } from '@tanstack/react-query';
import courseQuestionApi from './course-question.api';
import { IGetCourseQuestion } from './course-question.interfaces';

const useCourseQuestionQuery = (payload?: IGetCourseQuestion) => {
  const queryResult = useQuery(['get-course-questions', payload], () =>
    courseQuestionApi.getAllCourseQuestions(payload),
  );
  return queryResult;
};

const useCourseQuestionQueryAsQuestions = (payload?: IGetCourseQuestion) => {
  const queryResult = useQuery(
    ['get-course-questions-as-questions', payload],
    () => courseQuestionApi.getAllCourseQuestions(payload),
    {
      select: (data) => data.map((d) => d.question)[0],
    },
  );
  return queryResult;
};

const useCourseQuestionDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-course-question-by-id', id],
    () => courseQuestionApi.getCourseQuestionById(id),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};

const courseQustionQueries = {
  useCourseQuestionQuery,
  useCourseQuestionDetailsQuery,
  useCourseQuestionQueryAsQuestions,
};

export default courseQustionQueries;
