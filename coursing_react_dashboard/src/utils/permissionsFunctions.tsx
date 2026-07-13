/* eslint-disable no-nested-ternary */
import { useMemo } from 'react';
import { store } from 'redux/store';

function GetUserPermission(permissionName: string) {
  const { permissions } = store.getState().auth;

  const allPermissions = permissions?.webContentsForDashboardRole?.permissions;

  const Permissions = useMemo(
    () =>
      allPermissions?.base
        ? [
            ...allPermissions.base,
            ...allPermissions.schooling.base,
            ...allPermissions.schooling.setting,
            ...allPermissions.setting,
            ...allPermissions.specialty.base,
            ...allPermissions.specialty.setting,
            ...allPermissions.university.base,
            ...allPermissions.university.setting,
          ].find(
            (permission) =>
              permission?.enName?.toLowerCase() ===
              permissionName.toLowerCase(),
          )
        : { canAction: false, canDelete: false, canView: false },
    [allPermissions, permissionName],
  );

  const selectedPermission =
    permissionName === 'forceAllow'
      ? { canAction: true, canDelete: true, canView: true }
      : Permissions;

  return selectedPermission;
}

export default GetUserPermission;
