import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import { IUniversity, IUniversityDetails } from './university.interfaces';
import UniversityApiRoutes from './university.api-routes';

const getAllUniversities = async (params?: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<IUniversity[]>>(
    UniversityApiRoutes.GetAllUniversities,
    {
      params,
    },
  );
  return data;
};

const getUniversityById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<IUniversityDetails>(
    UniversityApiRoutes.GetUniversityById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addUniversity = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(
    UniversityApiRoutes.AddUniversity,
    payload,
    {
      onUploadProgress: (e) => {
        setProgress((e.progress || 0) * 100);
      },
      signal: controller.signal,
    },
  );
  return data;
};

const updateUniversity = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.put(
    UniversityApiRoutes.UpdateUniversity,
    payload,
    {
      onUploadProgress: (e) => {
        setProgress((e.progress || 0) * 100);
      },
      signal: controller.signal,
    },
  );
  return data;
};

const removeUniversity = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    UniversityApiRoutes.RemoveUniversity,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const universityApi = {
  getAllUniversities,
  getUniversityById,
  addUniversity,
  updateUniversity,
  removeUniversity,
};

export default universityApi;
