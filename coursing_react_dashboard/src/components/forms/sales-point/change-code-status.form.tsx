/* eslint-disable no-unneeded-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  IChangeCodeStatusPayloadForm,
  IPointsCodes,
} from 'apis/sales-point/sales-point.interfaces';
import { codeStatus } from 'constants/constants';
import { getNameById } from 'hooks/use-generic-form/helpers';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function ChangeCodeStatusForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<IChangeCodeStatusPayloadForm>;
  editItem: IPointsCodes | null;
}) {
  const { t } = useTranslation();
  const { GenericForm, setValue } =
    useGenericForm<IChangeCodeStatusPayloadForm>({
      inputs: [
        {
          name: 'statusCode',
          defaultValue: editItem?.codeStatus
            ? {
                id: editItem.codeStatus,
                name: getNameById(codeStatus, String(editItem.codeStatus)),
              }
            : null,
          label: t('requestPaper.status'),
          type: 'select',
          required: true,
          disabled: !editItem?.canChangeStatus ? true : false,
          md: 12,
          options:
            codeStatus
              .filter((f) => f.id === 1 || f.id === 3)
              .map((status) => ({
                id: status.id,
                name: t(status.name),
              })) || [],
        },
      ],
      onSubmit: (data) => onSubmit(data),
    });

  useEffect(() => {
    if (editItem?.codeStatus) {
      setValue('statusCode.id', editItem.codeStatus);
      setValue(
        'statusCode.name',
        t(getNameById(codeStatus, String(editItem.codeStatus))),
      );
    }
  }, [editItem?.codeStatus]);

  return GenericForm;
}

export default ChangeCodeStatusForm;
