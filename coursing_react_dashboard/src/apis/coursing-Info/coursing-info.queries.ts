import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import coursingInfoApis from './coursing-info.api';

const useGetAllCoursingInfo = (payload: IPaginationParams) => {
  const queryResult = useQuery(['get-all-coursing-info', payload], () =>
    coursingInfoApis.getAllCoursingInfo(payload),
  );

  return queryResult;
};

const coursingInfoQueries = {
  useGetAllCoursingInfo,
};

export default coursingInfoQueries;
