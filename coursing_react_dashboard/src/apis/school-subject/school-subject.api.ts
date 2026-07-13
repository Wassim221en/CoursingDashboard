import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import {
  IGetSchoolSubjectPayload,
  ISchoolSubject,
  ISchoolSubjectDetails,
} from './school-subject.interfaces';
import SubjectApiRoutes from './school-subject.api-routes';

const getAllSchoolSubjects = async (
  payload?: IGetSchoolSubjectPayload & IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<ISchoolSubject[]>>(
    SubjectApiRoutes.GetAllSchoolSubjects,
    {
      params: payload,
    },
  );
  return data;
};

const getSchoolSubjectById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ISchoolSubjectDetails>(
    SubjectApiRoutes.GetSchoolSubjectById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addSchoolSubject = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.post(
    SubjectApiRoutes.AddSchoolSubject,
    payload,
  );
  return data;
};

const updateSchoolSubject = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.put(
    SubjectApiRoutes.UpdateSchoolSubject,
    payload,
  );
  return data;
};

const removeSchoolSubject = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    SubjectApiRoutes.RemoveSchoolSubject,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const schoolSubjectApi = {
  getAllSchoolSubjects,
  getSchoolSubjectById,
  addSchoolSubject,
  updateSchoolSubject,
  removeSchoolSubject,
};

export default schoolSubjectApi;
