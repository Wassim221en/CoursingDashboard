import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import { ISemester, ISemesterPayload } from './semester.interfaces';
import SemesterApiRoutes from './semester.api-routes';

const getAllSemesters = async (params?: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<ISemester[]>>(
    SemesterApiRoutes.GetAllSemesters,
    {
      params,
    },
  );
  return data;
};

const getSemesterById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ISemester>(
    SemesterApiRoutes.GetSemesterById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addSemester = async (payload: ISemesterPayload) => {
  const { data } = await CoursingApiInstance.post(
    SemesterApiRoutes.AddSemester,
    payload,
  );
  return data;
};

const updateSemester = async (payload: ISemesterPayload) => {
  const { data } = await CoursingApiInstance.put(
    SemesterApiRoutes.UpdateSemester,
    payload,
  );
  return data;
};

const removeSemester = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    SemesterApiRoutes.RemoveSemester,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const semesterApi = {
  getAllSemesters,
  getSemesterById,
  addSemester,
  updateSemester,
  removeSemester,
};

export default semesterApi;
