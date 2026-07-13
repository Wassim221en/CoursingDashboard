import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import {
  ISetUserPasswordPayload,
  IRoles,
  IUser,
  IUserPayload,
} from './users.interfaces';
import UsersApiRoutes from './users.api-routes';

const getAllUsers = async (payload: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<IUser[]>>(
    UsersApiRoutes.GetAll,
    {
      params: payload,
    },
  );

  return data;
};

const addUser = async (payload: IUserPayload) => {
  const { data } = await CoursingApiInstance.post(UsersApiRoutes.Add, payload);
  return data;
};

const updateUser = async (payload: IUserPayload) => {
  const { data } = await CoursingApiInstance.put(
    UsersApiRoutes.update,
    payload,
  );
  return data;
};

const setUserPassword = async (payload: ISetUserPasswordPayload) => {
  await CoursingApiInstance.put(UsersApiRoutes.setUserPassword, payload);
};

const getAllRoles = async () => {
  const { data } = await CoursingApiInstance.get<IRoles[]>(
    UsersApiRoutes.GetAllRoles,
  );

  return data;
};

const usersApis = {
  getAllUsers,
  addUser,
  updateUser,
  setUserPassword,
  getAllRoles,
};

export default usersApis;
