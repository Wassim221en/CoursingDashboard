import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import {
  IAddPointsToStudentPayload,
  IChangeStudentAccountStatusPayload,
  IChangeStudentStatePayload,
  IGetStudentPayload,
  INewRegistrationStudents,
  IStudent,
  IStudentBalance,
  IStudentDetails,
  IUpdateStudentBalancePayload,
} from './student.interfaces';
import StudentApiRoutes from './student.api-routes';

const getAllStudents = async (
  params?: IPaginationParams & IGetStudentPayload,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<IStudent[]>>(
    StudentApiRoutes.GetAllStudents,
    {
      params,
    },
  );
  return data;
};

const getStudentDetails = async (id: number) => {
  const { data } = await CoursingApiInstance.get<IResponse<IStudentDetails>>(
    StudentApiRoutes.GetStudentDetails,
    {
      params: {
        studentId: id,
      },
    },
  );
  return data;
};

const getStudentBalance = async (studentId: number) => {
  const { data } = await CoursingApiInstance.get<IStudentBalance>(
    StudentApiRoutes.GetStudentBalance,
    {
      params: { studentId },
    },
  );

  return data;
};

const addPointsToStudents = async (payload: IAddPointsToStudentPayload) => {
  const { data } = await CoursingApiInstance.post(
    StudentApiRoutes.AddPointsToStudent,
    null,
    {
      params: payload,
    },
  );

  return data;
};

const updateStudentBalance = async (payload: IUpdateStudentBalancePayload) => {
  const { data } = await CoursingApiInstance.put(
    StudentApiRoutes.UpdateStudentBalance,
    null,
    {
      params: payload,
    },
  );

  return data;
};

const generateCodeFromBaseSalesPoint = async (numberOfPoints: number) => {
  const { data } = await CoursingApiInstance.post(
    StudentApiRoutes.GenerateCodeFromBaseSalesPoint,
    null,
    {
      params: { numberOfPoints },
    },
  );

  return { data };
};

const getNewRegistrationStudents = async (payload: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<
    IResponse<INewRegistrationStudents[]>
  >(StudentApiRoutes.GetNewRegistrationStudents, {
    params: payload,
  });
  return data;
};

const changeStudentAccountStatus = async (
  payload: IChangeStudentAccountStatusPayload,
) => {
  const { data } = await CoursingApiInstance.post(
    StudentApiRoutes.ChangeStudentAccountStatus,
    null,
    {
      params: payload,
    },
  );

  return data;
};

const UpdateStudentState = async (payload: IChangeStudentStatePayload) => {
  const { data } = await CoursingApiInstance.put(
    StudentApiRoutes.UpdateStudentState,
    payload,
  );

  return data;
};

const studentApi = {
  getAllStudents,
  getStudentDetails,
  getStudentBalance,
  addPointsToStudents,
  updateStudentBalance,
  generateCodeFromBaseSalesPoint,
  getNewRegistrationStudents,
  changeStudentAccountStatus,
  UpdateStudentState,
};

export default studentApi;
