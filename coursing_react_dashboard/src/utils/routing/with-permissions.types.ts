import { ReactElement, ReactNode } from 'react';

export type PageWithPermissionsProps = {
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

export type PageWithPermissions<T = {}> = (
  props: {
    children?: ReactNode;
  } & PageWithPermissionsProps &
    T,
) => ReactElement<any, any>;
