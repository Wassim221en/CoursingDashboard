import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import {
  IEducationalLevel,
  IEducationalLevelDetails,
  IEducationalLevelPayload,
  IGetEducationalLevelPayload,
} from './educational-level.interfaces';
import EducationalLevelApiRoutes from './educational-level.api-routes';

const getAllEducationalLevels = async (
  payload?: IGetEducationalLevelPayload,
) => {
  const { data } = await CoursingApiInstance.get<
    IResponse<IEducationalLevel[]>
  >(EducationalLevelApiRoutes.GetAllEducationalLevels, {
    params: payload,
  });
  return data;
};

const getEducationalLevelById = async (
  id: number,
  pagination: IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<IEducationalLevelDetails>(
    EducationalLevelApiRoutes.GetEducationalLevelById,
    {
      params: {
        id,
        pagination,
      },
    },
  );
  return data;
};

const addEducationalLevel = async (payload: IEducationalLevelPayload) => {
  const { data } = await CoursingApiInstance.post(
    EducationalLevelApiRoutes.AddEducationalLevel,
    payload,
  );
  return data;
};

const updateEducationalLevel = async (payload: IEducationalLevelPayload) => {
  const { data } = await CoursingApiInstance.put(
    EducationalLevelApiRoutes.UpdateEducationalLevel,
    payload,
  );
  return data;
};

const removeEducationalLevel = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    EducationalLevelApiRoutes.RemoveEducationalLevel,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const educationalLevelApi = {
  getAllEducationalLevels,
  getEducationalLevelById,
  addEducationalLevel,
  updateEducationalLevel,
  removeEducationalLevel,
};

export default educationalLevelApi;
