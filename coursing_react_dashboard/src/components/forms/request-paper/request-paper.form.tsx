/* eslint-disable react-hooks/exhaustive-deps */
import {
  IRequestPaper,
  IRequestPaperPayloadForm,
} from 'apis/request-paper/request-paper.interfaces';
import { RequestPaperCopyStatus } from 'constants/constants';
import { getNameById } from 'hooks/use-generic-form/helpers';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function RequestPaperForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<IRequestPaperPayloadForm>;
  editItem: IRequestPaper | null;
}) {
  const { t } = useTranslation();
  const { GenericForm, setValue } = useGenericForm<IRequestPaperPayloadForm>({
    inputs: [
      {
        name: 'status',
        defaultValue: editItem?.status
          ? {
              id: editItem.status,
              name: getNameById(
                RequestPaperCopyStatus,
                String(editItem.status),
              ),
            }
          : null,
        label: t('requestPaper.status'),
        type: 'select',
        required: true,
        md: 12,
        options:
          RequestPaperCopyStatus.map((request) => ({
            id: request.id,
            name: t(request.name),
          })) || [],
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  useEffect(() => {
    if (editItem?.status) {
      setValue('status.id', editItem.status);
      setValue(
        'status.name',
        t(getNameById(RequestPaperCopyStatus, String(editItem.status))),
      );
    }
  }, [editItem?.status]);

  return GenericForm;
}

export default RequestPaperForm;
