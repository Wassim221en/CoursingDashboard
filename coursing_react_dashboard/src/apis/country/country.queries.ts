import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import { useQuery } from '@tanstack/react-query';
import countryApi from './country.api';

const useCountriesQuery = (params?: IPaginationParams) => {
  const queryResult = useQuery(['get-countries', params], () =>
    countryApi.getAllCountries(params),
  );
  return queryResult;
};

const useCountryDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-country-by-id', id],
    () => countryApi.getCountryById(id),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};

const countryQueries = {
  useCountryDetailsQuery,
  useCountriesQuery,
};

export default countryQueries;
