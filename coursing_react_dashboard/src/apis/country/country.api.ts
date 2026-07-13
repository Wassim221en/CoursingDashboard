import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import CoursingApiInstance from 'apis/coursing-api.instance';
import { ICountry, ICountryPayload } from './country.interfaces';
import CountryApiRoutes from './country.api-routes';

const getAllCountries = async (params?: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<ICountry[]>>(
    CountryApiRoutes.GetAllCountries,
    {
      params,
    },
  );
  return data;
};

const getCountryById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ICountry>(
    CountryApiRoutes.GetCountryById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addCountry = async (payload: ICountryPayload) => {
  const { data } = await CoursingApiInstance.post(
    CountryApiRoutes.AddCountry,
    payload,
  );
  return data;
};

const updateCountry = async (payload: ICountryPayload) => {
  const { data } = await CoursingApiInstance.put(
    CountryApiRoutes.UpdateCountry,
    payload,
  );
  return data;
};

const removeCountry = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    CountryApiRoutes.RemoveCountry,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const countryApi = {
  getAllCountries,
  getCountryById,
  addCountry,
  updateCountry,
  removeCountry,
};

export default countryApi;
