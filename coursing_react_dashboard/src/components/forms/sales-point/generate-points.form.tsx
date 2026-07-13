import {
  IGeneratePointsPayload,
  IGeneratePointsPayloadForm,
  IPointsForSalePoint,
} from 'apis/sales-point/sales-point.interfaces';
import {} from 'apis/school-subject/school-subject.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

type Props = {
  onSubmit: TSubmitHandler<IGeneratePointsPayload>;
  editItem?: IPointsForSalePoint | null;
};

function GeneratePointsForSalePoint({ onSubmit }: Props) {
  const { t } = useTranslation();

  const { GenericForm } = useGenericForm<IGeneratePointsPayloadForm>({
    inputs: [
      {
        name: 'PointNumber',
        defaultValue: 0,
        label: t('salesPoints.cardsNumber'),
        type: 'number',
        required: true,
        md: 12,
      },
      {
        name: 'point',
        defaultValue: 0,
        label: t('salesPoints.pointsNumberForEachCard'),
        type: 'number',
        required: true,
        md: 12,
      },
      {
        name: 'expiredate',
        defaultValue: null,
        label: t('salesPoints.expireDate'),
        type: 'date',
        required: true,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default GeneratePointsForSalePoint;
