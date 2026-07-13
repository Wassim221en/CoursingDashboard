import { IFaq, IFaqPayload } from 'apis/faq/faq.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

function FaqForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<IFaqPayload>;
  editItem: IFaq | null;
}) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<IFaqPayload>({
    inputs: [
      {
        name: 'question',
        defaultValue: editItem?.question || '',
        label: t('questionsBank.question'),
        type: 'text',
        required: true,
        md: 12,
        html: true,
      },
      {
        name: 'answer',
        defaultValue: editItem?.answer || '',
        label: t('questionsBank.answers'),
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

export default FaqForm;
