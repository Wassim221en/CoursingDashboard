import {
  ISchoolUnit,
  ISchoolUnitPayloadForm,
} from 'apis/school-unit/school-unit.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

type Props = {
  onSubmit: TSubmitHandler<ISchoolUnitPayloadForm>;
  editItem: ISchoolUnit | null;
};

function UnitForm({ onSubmit, editItem }: Props) {
  const { t } = useTranslation();

  const { GenericForm } = useGenericForm<ISchoolUnitPayloadForm>({
    inputs: [
      {
        name: 'title',
        defaultValue: editItem?.title || '',
        label: t('unit-form.title'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'description',
        defaultValue: editItem?.description || '',
        label: t('unit-form.description'),
        type: 'text',
        html: true,
        required: false,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default UnitForm;
