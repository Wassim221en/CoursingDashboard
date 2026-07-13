import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import appRatingApis from './app-rrating.api';

const useAppRatingQuery = (payload: IPaginationParams) => {
  const queryResult = useQuery(['get-app-rating', payload], () =>
    appRatingApis.getCoursingRating(payload),
  );

  return queryResult;
};

const appRatingQueries = {
  useAppRatingQuery,
};

export default appRatingQueries;
