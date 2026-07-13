import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import { IInstructor, IInstructorEdit } from './instructor.interfaces';
import InstructorApiRoutes from './instructor.api-routes';

const getAllInstructor = async (params?: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<IInstructor[]>>(
    InstructorApiRoutes.GetAllInstructors,
    {
      params,
    },
  );
  return data;
};

const addInstructor = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.post(
    InstructorApiRoutes.AddInstructor,
    payload,
  );
  return data;
};

const updateInstructor = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.put(
    InstructorApiRoutes.UpdateInstructor,
    payload,
  );
  return data;
};

const getInstructorById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<IInstructorEdit>(
    InstructorApiRoutes.GetInstructorById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addInstructorCertificate = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.post(
    InstructorApiRoutes.AddInstructorCertificate,
    payload,
  );
  return data;
};

const updateInstructorCertificate = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.put(
    InstructorApiRoutes.UpdateInstructorCertificate,
    payload,
  );
  return data;
};

const removeInstructorCertificate = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    InstructorApiRoutes.RemoveInstructorCertificate,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const removeInstructor = async (InstructorId: number) => {
  const { data } = await CoursingApiInstance.delete(
    InstructorApiRoutes.RemoveInstructor,
    {
      params: { InstructorId },
    },
  );
  return data;
};

const instructorApi = {
  addInstructor,
  getAllInstructor,
  removeInstructor,
  updateInstructor,
  getInstructorById,
  addInstructorCertificate,
  updateInstructorCertificate,
  removeInstructorCertificate,
};

export default instructorApi;
