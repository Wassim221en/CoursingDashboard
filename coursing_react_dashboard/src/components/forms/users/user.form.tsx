import { IUser, IUserPayloadForm } from 'apis/users/users.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import usersQueries from 'apis/users/users.queries';

type Props = {
  onSubmit: TSubmitHandler<IUserPayloadForm>;
  editItem: IUser | null;
};

function UsersForm({ onSubmit, editItem }: Props) {
  const { t } = useTranslation();

  const { data: roles, isLoading: isLoadingRols } =
    usersQueries.useAllRolesQueries();

  const { GenericForm } = useGenericForm<IUserPayloadForm>({
    inputs: [
      {
        name: 'userName',
        defaultValue: editItem?.userName || '',
        label: t('instructors.username'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'fullName',
        defaultValue: editItem?.fullName || '',
        label: t('instructors.fullName'),
        type: 'text',
        required: true,
        md: 12,
      },

      {
        name: 'email',
        defaultValue: editItem?.email || '',
        label: t('users.email'),
        type: 'text',
        required: false,
        md: 12,
      },
      {
        name: 'phoneNumber',
        defaultValue: editItem?.phoneNumber || 0,
        label: t('users.phoneNumber'),
        type: 'number',
        required: true,
        min: 6,
        md: 12,
      },
      {
        name: 'password',
        defaultValue: '',
        label: t('rooms.password'),
        type: 'text',
        required: !editItem?.id,
        hidden: !!editItem?.id,
        isPassword: true,
        md: 12,
      },

      {
        name: 'roleId',
        defaultValue: editItem?.roles[0]
          ? {
              id: editItem?.roles[0].id,
              name: editItem?.roles[0].roleName,
            }
          : null,
        type: 'select',
        label: t('users.roles'),
        isLoading: isLoadingRols,
        options:
          roles?.map((role) => ({
            id: role.id,
            name: role.roleName,
          })) || [],
        required: true,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default UsersForm;
