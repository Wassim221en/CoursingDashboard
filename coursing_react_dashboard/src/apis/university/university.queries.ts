import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import { useQuery } from '@tanstack/react-query';
import universityApi from './university.api';

const useUniversitiesQuery = (
  params?: IPaginationParams,
  disabled: boolean = false,
) => {
  const queryResult = useQuery(
    ['get-universities', params],
    () => universityApi.getAllUniversities(params),
    {
      enabled: !disabled,
    },
  );
  return queryResult;
};

const useUniversityDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-university-by-id', id],
    () => universityApi.getUniversityById(id),
    {
      enabled: !!id,
      cacheTime: 0,
    },
  );
  return queryResult;
};

const universityQueries = {
  useUniversityDetailsQuery,
  useUniversitiesQuery,
};

export default universityQueries;
