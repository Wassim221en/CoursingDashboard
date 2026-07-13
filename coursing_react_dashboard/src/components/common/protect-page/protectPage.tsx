import UnAuthorizedPage from 'pages/error-pages/unAuthorized.page';
import { store } from 'redux/store';
import getRoutePermission from './components/getRoutePermission';

type ProtectPageProps = {
  Page: any;
  controllerName?: string;
  internalPathNameSearch?: boolean;
};

function ProtectPage({
  Page,
  controllerName = '',
  internalPathNameSearch = false,
}: ProtectPageProps) {
  if (internalPathNameSearch) {
    controllerName = getRoutePermission();
  }

  const { permissions } = store.getState().auth;

  const allPermissions = permissions?.webContentsForDashboardRole?.permissions;

  const Permissions = allPermissions?.base
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
          permission?.enName?.toLowerCase() === controllerName?.toLowerCase(),
      )
    : { canView: false };

  return Permissions?.canView ? Page : UnAuthorizedPage;
}

export default ProtectPage;
