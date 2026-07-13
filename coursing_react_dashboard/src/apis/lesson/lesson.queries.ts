import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import lessonApi from './lesson.api';
import { IGetLessonsPayload } from './lesson.interfaces';

const useLessonsInfiniteQuery = (
  payload: IGetLessonsPayload & IPaginationParams,
) => {
  const queryResult = useInfiniteQuery(
    ['get-lessons-infinte-query', payload],
    async ({ pageParam = 0 }) => {
      const result = await lessonApi.getAllLessons({
        ...payload,
        pageNumber: pageParam,
      });
      return {
        data: result,
        pageParam: pageParam + 1,
      };
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

const useLessonsQuery = (
  payload: IGetLessonsPayload & IPaginationParams,
  disabled: Boolean = false,
) => {
  const queryResult = useQuery(
    ['get-lessons', payload],
    () => lessonApi.getAllLessons(payload),
    {
      enabled: !!payload.courseId && !disabled,
    },
  );
  return queryResult;
};

const useLessonsDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-lesson', id],
    () => lessonApi.getLessonById(id),
    {
      cacheTime: 0,
      enabled: !!id,
    },
  );
  return queryResult;
};

const lessonQueries = {
  useLessonsQuery,
  useLessonsDetailsQuery,
  useLessonsInfiniteQuery,
};

export default lessonQueries;
