import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import collegeApi from './college.api';
import { IGetCollegePayload } from './college.interfaces';

const useCollegesQuery = (
  payload?: IGetCollegePayload & IPaginationParams,
  disabled?: boolean,
) => {
  const queryResult = useQuery(
    ['get-colleges', payload],
    () => collegeApi.getAllColleges(payload),
    {
      enabled: !disabled,
    },
  );
  return queryResult;
};

const useCollegeDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-college-by-id', id],
    () => collegeApi.getCollegeById(id),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};

const collegeQueries = {
  useCollegeDetailsQuery,
  useCollegesQuery,
};

export default collegeQueries;
