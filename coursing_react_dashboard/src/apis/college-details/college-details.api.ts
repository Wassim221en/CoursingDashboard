import { IResponse } from 'apis/global-interfaces/global-interfaces';
import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  ICollegeDetails,
  IGetCollegeDetailsPayload,
} from './college-details.interfaces';
import CollegeDetailsApiRoutes from './college-details.api-routes';

const getAllCollegeDetails = async (payload?: IGetCollegeDetailsPayload) => {
  const { data } = await CoursingApiInstance.get<IResponse<ICollegeDetails[]>>(
    CollegeDetailsApiRoutes.GetAllCollegeDetails,
    {
      params: payload,
    },
  );
  return data;
};

const getCollegeDetailsById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ICollegeDetails[]>(
    CollegeDetailsApiRoutes.GetCollegeDetailsById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addCollegeDetails = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.post(
    CollegeDetailsApiRoutes.AddCollegeDetails,
    payload,
  );
  return data;
};

const updateCollegeDetails = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.put(
    CollegeDetailsApiRoutes.UpdateCollegeDetails,
    payload,
  );
  return data;
};

const removeCollegeDetails = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    CollegeDetailsApiRoutes.RemoveCollegeDetails,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addCollegeDetailsSubject = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(
    CollegeDetailsApiRoutes.AddCollegeDetailsSubject,
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

const updateCollegeDetailsSubject = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(
    CollegeDetailsApiRoutes.UpdateCollegeDetailsSubject,
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

const removeCollegeDetailsSubject = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    CollegeDetailsApiRoutes.RemoveCollegeDetailsSubject,
    {
      params: { id },
    },
  );
  return data;
};

const collegeDetailsApi = {
  getAllCollegeDetails,
  getCollegeDetailsById,
  addCollegeDetails,
  updateCollegeDetails,
  removeCollegeDetails,
  addCollegeDetailsSubject,
  updateCollegeDetailsSubject,
  removeCollegeDetailsSubject,
};

export default collegeDetailsApi;
