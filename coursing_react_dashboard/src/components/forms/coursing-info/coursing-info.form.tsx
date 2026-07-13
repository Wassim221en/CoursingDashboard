/* eslint-disable react-hooks/exhaustive-deps */
import {
  ICoursingInfo,
  ICoursingInfoPayload,
} from 'apis/coursing-Info/coursing-info.interfaces';

import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

function CoursingInfoForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<ICoursingInfoPayload>;
  editItem: ICoursingInfo | null;
}) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<ICoursingInfoPayload>({
    inputs: [
      {
        name: 'description',
        defaultValue: editItem?.description || '',
        label: t('reports.description'),
        type: 'text',
        isMultiLine: true,
        md: 12,
      },
      {
        name: 'url',
        defaultValue: editItem?.url || '',
        label: t('coursingInfo.youtubeLink'),
        type: 'text',
        isMultiLine: true,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default CoursingInfoForm;
