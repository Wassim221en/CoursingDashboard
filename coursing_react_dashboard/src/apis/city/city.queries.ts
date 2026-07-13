import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import { useQuery } from '@tanstack/react-query';
import cityApi from './city.api';

const useCitiesQuery = (params?: IPaginationParams) => {
  const queryResult = useQuery(['get-cities', params], () =>
    cityApi.getAllCities(params),
  );
  return queryResult;
};

const useCityDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-city-by-id', id],
    () => cityApi.getCityById(id),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};

const cityQueries = {
  useCityDetailsQuery,
  useCitiesQuery,
};

export default cityQueries;
