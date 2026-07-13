import CoursingApiInstance from 'apis/coursing-api.instance';
import { IResponse } from 'apis/global-interfaces/global-interfaces';
import {
  ICollegeSubject,
  ICollegeSubjectDetails,
  ICollegeSubjectDetailsUnit,
  IGetCollegeSubjectPayload,
} from './college-subject.interfaces';
import SubjectApiRoutes from './college-subject.api-routes';

const getAllCollegeSubjects = async (payload?: IGetCollegeSubjectPayload) => {
  const { data } = await CoursingApiInstance.get<IResponse<ICollegeSubject[]>>(
    SubjectApiRoutes.GetAllCollegeSubjects,
    {
      params: payload,
    },
  );
  return data;
};

const getCollegeSubjectById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ICollegeSubjectDetails>(
    SubjectApiRoutes.GetCollegeSubjectById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addCollegeSubject = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.post<ICollegeSubject>(
    SubjectApiRoutes.AddCollegeSubject,
    payload,
  );
  return data;
};

const updateCollegeSubject = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.put(
    SubjectApiRoutes.UpdateCollegeSubject,
    payload,
  );
  return data;
};

const removeCollegeSubject = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    SubjectApiRoutes.RemoveCollegeSubject,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const getCollegeSubjectDetailsUnit = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ICollegeSubjectDetailsUnit>(
    SubjectApiRoutes.GetCollegeSubjectDetailsUnit,
    {
      params: { id },
    },
  );

  return data;
};

const subjectApi = {
  getAllCollegeSubjects,
  getCollegeSubjectById,
  getCollegeSubjectDetailsUnit,
  addCollegeSubject,
  updateCollegeSubject,
  removeCollegeSubject,
};

export default subjectApi;
