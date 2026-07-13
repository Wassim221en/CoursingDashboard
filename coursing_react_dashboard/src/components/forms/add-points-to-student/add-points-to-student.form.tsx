import { IAddPointsToStudentPayload } from 'apis/student/student.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

function AddPointsToStudentForm({
  onSubmit,
}: {
  onSubmit: TSubmitHandler<IAddPointsToStudentPayload>;
  editItem: null;
}) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<IAddPointsToStudentPayload>({
    inputs: [
      {
        name: 'salePointCode',
        defaultValue: '',
        label: t('salesPoints.code'),
        type: 'text',
        required: true,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default AddPointsToStudentForm;
