import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import usersApis from './users.api';

const useUsersQueries = (payload: IPaginationParams) => {
  const queryResult = useQuery(['get-all-users', payload], () =>
    usersApis.getAllUsers(payload),
  );

  return queryResult;
};

const useAllRolesQueries = () => {
  const queryResult = useQuery(['get-all-roles'], () =>
    usersApis.getAllRoles(),
  );

  return queryResult;
};

const usersQueries = {
  useUsersQueries,
  useAllRolesQueries,
};

export default usersQueries;
