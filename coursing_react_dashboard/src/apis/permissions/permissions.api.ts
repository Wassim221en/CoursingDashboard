import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPermissionspayload,
  IWebContentsForRole,
} from './permissions.interfaces';
import { PermissionsApiRoutes } from './permissions.api-routes';

const GetWebContentsForRole = async (roleId: number) => {
  const { data } = await CoursingApiInstance.get<IWebContentsForRole>(
    PermissionsApiRoutes.GetWebContentsForRole,
    {
      params: { roleId, isForDashboard: true },
    },
  );

  return data;
};

const actionPermissions = async (payload: IPermissionspayload) => {
  const { data } = await CoursingApiInstance.post(
    PermissionsApiRoutes.ActionPermission,
    payload,
  );
  return data;
};

const PermissionsApis = {
  GetWebContentsForRole,
  actionPermissions,
};

export default PermissionsApis;
