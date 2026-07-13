import { useQuery } from '@tanstack/react-query';
import collegeApi from './college-details.api';
import { IGetCollegeDetailsPayload } from './college-details.interfaces';

const useGetAllCollegeDetailsQuery = (payload?: IGetCollegeDetailsPayload) => {
  const queryResult = useQuery(
    ['get-colleges', payload],
    () => collegeApi.getAllCollegeDetails(payload),
    {
      enabled: !!payload?.collegeId,
    },
  );
  return queryResult;
};

const useCollegeDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-college-by-id', id],
    () => collegeApi.getCollegeDetailsById(id),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};

const collegeDetailsQueries = {
  useCollegeDetailsQuery,
  useGetAllCollegeDetailsQuery,
};

export default collegeDetailsQueries;
