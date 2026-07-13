import {
  IEducationalLevelDetails,
  IEducationalLevelPayloadForm,
} from 'apis/educational-level/educational-level.interfaces';
import gradeQueries from 'apis/grade/grade.queries';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

function EducationalLevelForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<IEducationalLevelPayloadForm>;
  editItem: IEducationalLevelDetails | null;
}) {
  const { t } = useTranslation();
  const { data: grades, isLoading } = gradeQueries.useGradesQuery();

  const { GenericForm } = useGenericForm<IEducationalLevelPayloadForm>({
    inputs: [
      {
        name: 'name',
        defaultValue: editItem?.name || '',
        label: t('rooms.name'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'gradesIds',
        defaultValue: editItem?.grades || [],
        label: t('schooling.grades'),
        type: 'select',
        required: true,
        md: 12,
        options: grades?.data || [],
        isLoading,
        isMulti: true,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default EducationalLevelForm;
