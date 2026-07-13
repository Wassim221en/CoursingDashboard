import { IResponse } from 'apis/global-interfaces/global-interfaces';
import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  ISpecialized,
  ISpecializedPayload,
  ISpecializedUnit,
} from './specialized.interfaces';
import SpecializedApiRoutes from './specialized.api-routes';

const getAllSpecialized = async () => {
  const { data } = await CoursingApiInstance.get<IResponse<ISpecialized[]>>(
    SpecializedApiRoutes.GetAllSpecialized,
  );
  return data;
};

const getSpecializedById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ISpecialized>(
    SpecializedApiRoutes.GetSpecializedById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const GetByIdWithQuestion = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ISpecializedUnit>(
    SpecializedApiRoutes.GetByIdWithQuestion,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addSpecialized = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.post(
    SpecializedApiRoutes.AddSpecialized,
    payload,
  );
  return data;
};

const updateSpecialized = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.put(
    SpecializedApiRoutes.UpdateSpecialized,
    payload,
  );
  return data;
};

const removeSpecialized = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    SpecializedApiRoutes.RemoveSpecialized,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const GetAllSpecializedWithQuestion = async () => {
  const { data } = await CoursingApiInstance.get<IResponse<ISpecializedUnit[]>>(
    SpecializedApiRoutes.GetAllWithQuestion,
  );

  return data;
};

const specializedApi = {
  getAllSpecialized,
  getSpecializedById,
  GetAllSpecializedWithQuestion,
  addSpecialized,
  updateSpecialized,
  removeSpecialized,
  GetByIdWithQuestion,
};

export default specializedApi;
