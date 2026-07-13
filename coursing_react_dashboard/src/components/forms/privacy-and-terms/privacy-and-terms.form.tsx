import {
  IPrivacyAndTerms,
  IPrivacyAndTermsPayloadForm,
} from 'apis/privacyAndTerms/privacyAndTerms.interfaces';
import { PrivacyAndTerms } from 'constants/constants';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

function PrivacyAndTermsForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<IPrivacyAndTermsPayloadForm>;
  editItem: IPrivacyAndTerms | null;
}) {
  const { t } = useTranslation();

  const { GenericForm } = useGenericForm<IPrivacyAndTermsPayloadForm>({
    inputs: [
      {
        name: 'key',
        defaultValue: editItem?.key
          ? {
              id: Number(
                PrivacyAndTerms.find((f) =>
                  t(f.name).includes(String(editItem?.key)),
                )?.id,
              ),
              name: String(editItem.key),
            }
          : null,
        label: t('privacyAndTerms.key'),
        type: 'select',
        options: PrivacyAndTerms.map((item) => ({
          id: item.id,
          name: t(item.name),
        })),
        required: true,
        md: 12,
      },
      {
        name: 'value',
        defaultValue: editItem?.value || '',
        label: t('privacyAndTerms.value'),
        type: 'text',
        required: true,
        md: 12,
        html: true,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default PrivacyAndTermsForm;
