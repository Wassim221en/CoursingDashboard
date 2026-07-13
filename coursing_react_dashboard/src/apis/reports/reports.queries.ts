import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import { IGetReportsPayload } from './reports.interfaces';
import ReportsApis from './reports.api';

const useReportsQuery = (payload: IPaginationParams & IGetReportsPayload) => {
  const queryResult = useQuery(['get-all-reports', payload], () =>
    ReportsApis.getAllReports(payload),
  );

  return queryResult;
};

const reportsQueries = {
  useReportsQuery,
};

export default reportsQueries;
