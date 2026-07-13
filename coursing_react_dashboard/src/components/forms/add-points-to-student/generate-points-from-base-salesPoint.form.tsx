import { IGeneratePointsFromBaseSalesPoint } from 'apis/student/student.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

function GeneratePointsFromBaseSalesPointFrom({
  onSubmit,
}: {
  onSubmit: TSubmitHandler<IGeneratePointsFromBaseSalesPoint>;
  editItem: null;
}) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<IGeneratePointsFromBaseSalesPoint>({
    inputs: [
      {
        name: 'numberOfPoints',
        defaultValue: 0,
        label: t('salesPoints.pointsNumber'),
        type: 'number',
        required: true,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default GeneratePointsFromBaseSalesPointFrom;
