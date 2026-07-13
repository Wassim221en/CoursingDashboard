import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import CoursingApiInstance from 'apis/coursing-api.instance';
import { ICity, ICityPayload } from './city.interfaces';
import CityApiRoutes from './city.api-routes';

const getAllCities = async (params?: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<ICity[]>>(
    CityApiRoutes.GetAllCities,
    {
      params,
    },
  );
  return data;
};

const getCityById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ICity>(
    CityApiRoutes.GetCityById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addCity = async (payload: ICityPayload) => {
  const { data } = await CoursingApiInstance.post(
    CityApiRoutes.AddCity,
    payload,
  );
  return data;
};

const updateCity = async (payload: ICityPayload) => {
  const { data } = await CoursingApiInstance.put(
    CityApiRoutes.UpdateCity,
    payload,
  );
  return data;
};

const removeCity = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(CityApiRoutes.RemoveCity, {
    params: {
      id,
    },
  });
  return data;
};

const cityApi = {
  getAllCities,
  getCityById,
  addCity,
  updateCity,
  removeCity,
};

export default cityApi;
