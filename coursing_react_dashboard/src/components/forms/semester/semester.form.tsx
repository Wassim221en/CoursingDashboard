import { ISemester, ISemesterPayload } from 'apis/semester/semester.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

function SemesterForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<ISemesterPayload>;
  editItem: ISemester | null;
}) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<ISemesterPayload>({
    inputs: [
      {
        name: 'name',
        defaultValue: editItem?.name || '',
        label: t('universities.semesterName'),
        type: 'text',
        required: true,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default SemesterForm;
