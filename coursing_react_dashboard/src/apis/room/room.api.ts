import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import RoomApiRoutes from './room.api-routes';
import { IRoom, IRoomPayload, IUserRoomPayload } from './room.interfaces';

const getAllRooms = async (params?: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<IRoom[]>>(
    RoomApiRoutes.GetAllRooms,
    {
      params,
    },
  );
  return data;
};

const getAllRoomUsers = async () => {
  const { data } = await CoursingApiInstance.get<IResponse<IRoom[]>>(
    RoomApiRoutes.GetAllRoomUsers,
  );
  return data;
};

const getRoomById = async (roomId: number) => {
  const { data } = await CoursingApiInstance.get<IRoom>(RoomApiRoutes.GetRoom, {
    params: {
      roomId,
    },
  });
  return data;
};

const addRoom = async (payload: IRoomPayload) => {
  const { data } = await CoursingApiInstance.post(
    RoomApiRoutes.AddRoom,
    payload,
  );
  return data;
};

const addUserRoom = async (payload: IUserRoomPayload) => {
  const { data } = await CoursingApiInstance.post(
    RoomApiRoutes.AddUserRoom,
    payload,
  );
  return data;
};

const updateRoom = async (payload: IRoomPayload) => {
  const { data } = await CoursingApiInstance.put(
    RoomApiRoutes.UpdateRoom,
    payload,
  );
  return data;
};

const removeRoom = async (roomId: number) => {
  const { data } = await CoursingApiInstance.delete(RoomApiRoutes.RemoveRoom, {
    params: {
      roomId,
    },
  });
  return data;
};

const removeUserRoom = async (userRoomId: number, roomId: number) => {
  const { data } = await CoursingApiInstance.delete(
    RoomApiRoutes.RemoveUserRoom,
    {
      params: {
        userRoomId,
        roomId,
      },
    },
  );
  return data;
};

const roomApi = {
  getAllRooms,
  getAllRoomUsers,
  getRoomById,
  addRoom,
  addUserRoom,
  updateRoom,
  removeRoom,
  removeUserRoom,
};

export default roomApi;
