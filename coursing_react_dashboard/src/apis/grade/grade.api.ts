import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import {
  IGrade,
  IGradeSubject,
  IGradeSubjectDetails,
  IGetAllGradesPayload,
} from './grade.interfaces';
import GradeApiRoutes from './grade.api-routes';

const getAllGrades = async (params?: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<IGrade[]>>(
    GradeApiRoutes.GetAllGrades,
    {
      params,
    },
  );
  return data;
};

const getGradeById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<IGradeSubjectDetails>(
    GradeApiRoutes.GetGradeById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addGrade = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(
    GradeApiRoutes.AddGrade,
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

const updateGrade = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.put(
    GradeApiRoutes.UpdateGrade,
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

const removeGrade = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    GradeApiRoutes.RemoveGrade,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const getAllGradeSubjects = async (payload?: IGetAllGradesPayload) => {
  const { data } = await CoursingApiInstance.get<IResponse<IGradeSubject[]>>(
    GradeApiRoutes.GetAllGradeSubjects,
    {
      params: payload,
    },
  );
  return data;
};

const getGradeSubjectById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<IGradeSubjectDetails>(
    GradeApiRoutes.GetGradeSubjectById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addGradeSubject = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(
    GradeApiRoutes.AddGradeSubject,
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

const updateGradeSubject = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.put(
    GradeApiRoutes.UpdateGradeSubject,
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

const removeGradeSubject = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    GradeApiRoutes.RemoveGradeSubject,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const gradeApi = {
  getAllGrades,
  getGradeById,
  addGrade,
  updateGrade,
  removeGrade,
  getAllGradeSubjects,
  getGradeSubjectById,
  addGradeSubject,
  updateGradeSubject,
  removeGradeSubject,
};

export default gradeApi;
