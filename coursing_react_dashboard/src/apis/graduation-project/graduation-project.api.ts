import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import {
  IGetGraduationProjectPayload,
  IGraduationProject,
} from './graduation-project.interfaces';
import GraduationProjectApiRoutes from './graduation-project.api-routes';

const getAllGraduationProjectByGradeId = async (
  payload: IGetGraduationProjectPayload & IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<
    IResponse<IGraduationProject[]>
  >(GraduationProjectApiRoutes.GetAllGraduationProjectByGradeId, {
    params: payload,
  });
  return data;
};

const getGraduationProjectById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<IGraduationProject>(
    GraduationProjectApiRoutes.GetGraduationProjectById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addGraduationProject = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.post(
    GraduationProjectApiRoutes.AddGraduationProject,
    payload,
  );
  return data;
};

const updateGraduationProject = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.put(
    GraduationProjectApiRoutes.UpdateGraduationProject,
    payload,
  );
  return data;
};

const removeGraduationProject = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    GraduationProjectApiRoutes.RemoveGraduationProject,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const graduationProjectApi = {
  getAllGraduationProjectByGradeId,
  getGraduationProjectById,
  addGraduationProject,
  updateGraduationProject,
  removeGraduationProject,
};

export default graduationProjectApi;
