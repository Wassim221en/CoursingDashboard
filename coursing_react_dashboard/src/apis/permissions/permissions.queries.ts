import { useQuery } from '@tanstack/react-query';
import PermissionsApis from './permissions.api';

const useWebContentsForRoleQueries = (roleId: number) => {
  const queryResult = useQuery(['get-web-contents-for-role', roleId], () =>
    PermissionsApis.GetWebContentsForRole(roleId),
  );
  return queryResult;
};

const permissionsQueries = {
  useWebContentsForRoleQueries,
};

export default permissionsQueries;
