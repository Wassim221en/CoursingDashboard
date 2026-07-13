/* eslint-disable react-hooks/exhaustive-deps */
import {
  IChangeStudentAccountStatusPayloadForm,
  IStudent,
} from 'apis/student/student.interfaces';
import { accountStatus } from 'constants/constants';
import { getNameById } from 'hooks/use-generic-form/helpers';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function ChangeAccountStatusForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<IChangeStudentAccountStatusPayloadForm>;
  editItem: IStudent | null;
}) {
  const { t } = useTranslation();
  const { GenericForm, setValue } =
    useGenericForm<IChangeStudentAccountStatusPayloadForm>({
      inputs: [
        {
          name: 'accountStatus',
          defaultValue: editItem?.accountStatus
            ? {
                id: editItem.accountStatus,
                name: getNameById(
                  accountStatus,
                  String(editItem.accountStatus),
                ),
              }
            : null,
          label: t('requestPaper.status'),
          type: 'select',
          required: true,
          md: 12,
          options:
            accountStatus.map((status) => ({
              id: status.id,
              name: t(status.name),
            })) || [],
        },
      ],
      onSubmit: (data) => onSubmit(data),
    });

  useEffect(() => {
    if (editItem?.accountStatus) {
      setValue('accountStatus.id', editItem.accountStatus);
      setValue(
        'accountStatus.name',
        t(getNameById(accountStatus, String(editItem.accountStatus))),
      );
    }
  }, [editItem?.accountStatus]);

  return GenericForm;
}

export default ChangeAccountStatusForm;
