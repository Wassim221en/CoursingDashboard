import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import { useQuery } from '@tanstack/react-query';
import semesterApi from './semester.api';

const useSemestersQuery = (params?: IPaginationParams) => {
  const queryResult = useQuery(['get-semesters', params], () =>
    semesterApi.getAllSemesters(params),
  );
  return queryResult;
};

const useSemesterDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-semester-by-id', id],
    () => semesterApi.getSemesterById(id),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};

const semesterQueries = {
  useSemesterDetailsQuery,
  useSemestersQuery,
};

export default semesterQueries;
