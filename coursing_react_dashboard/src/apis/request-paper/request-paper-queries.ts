import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import RequestPaperApis from './request-paper.api';

const useRequestPaperQuery = (payload: IPaginationParams) => {
  const queryResult = useQuery(['get-all-request-paper', payload], () =>
    RequestPaperApis.getAllPaperRequsets(payload),
  );
  return queryResult;
};

const requestPapersQueries = {
  useRequestPaperQuery,
};

export default requestPapersQueries;
