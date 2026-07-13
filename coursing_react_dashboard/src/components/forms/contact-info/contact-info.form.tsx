/* eslint-disable react-hooks/exhaustive-deps */
import {
  IContactInfo,
  IContactInfoPayload,
} from 'apis/contact-info/contact-info.interfaces';

import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

function ContactInfoForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<IContactInfoPayload>;
  editItem: IContactInfo | null;
}) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<IContactInfoPayload>({
    inputs: [
      {
        name: 'value',
        defaultValue: editItem?.value || '',
        label: t('privacyAndTerms.value'),
        type: 'text',
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default ContactInfoForm;
