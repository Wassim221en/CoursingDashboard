import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import roomApi from './room.api';

const useRoomQuery = (params?: IPaginationParams) => {
  const queryResult = useQuery(['get-rooms', params], () =>
    roomApi.getAllRooms(params),
  );
  return queryResult;
};

const useRoomDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-room-by-id', id],
    () => roomApi.getRoomById(id),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};

const roomQueries = {
  useRoomDetailsQuery,
  useRoomQuery,
};

export default roomQueries;
