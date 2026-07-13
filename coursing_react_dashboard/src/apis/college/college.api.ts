import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import { ICollege, IGetCollegePayload } from './college.interfaces';
import CollegeApiRoutes from './college.api-routes';

const getAllColleges = async (
  payload?: IGetCollegePayload & IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<ICollege[]>>(
    CollegeApiRoutes.GetAllColleges,
    {
      params: payload,
    },
  );
  return data;
};

const getCollegeById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ICollege>(
    CollegeApiRoutes.GetCollegeById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addCollege = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(
    CollegeApiRoutes.AddCollege,
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

const updateCollege = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.put(
    CollegeApiRoutes.UpdateCollege,
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

const removeCollege = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    CollegeApiRoutes.RemoveCollege,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const collegeApi = {
  getAllColleges,
  getCollegeById,
  addCollege,
  updateCollege,
  removeCollege,
};

export default collegeApi;
