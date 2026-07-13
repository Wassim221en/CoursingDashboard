import {
  ICollegeUnit,
  ICollegeUnitPayloadForm,
} from 'apis/college-unit/college-unit.interfaces';
import unitQueries from 'apis/college-unit/college-unit.queries';
import { TNestedItem } from 'hooks/use-generic-form/types';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

const generateNestedItem = (data: ICollegeUnit): TNestedItem => ({
  id: data.id,
  name: data.title,
  parentId: data.parentId,
  children: data.children.map((c) => generateNestedItem(c)),
});

type Props = {
  onSubmit: TSubmitHandler<ICollegeUnitPayloadForm>;
  collegeDetailsSubjectId: number;
};

function AddCollegeUnitForm({ onSubmit, collegeDetailsSubjectId }: Props) {
  const { t } = useTranslation();

  const { data: units, isLoading: isLoadingUnits } = unitQueries.useUnitsQuery({
    collegeDetailsSubjectId,
  });

  const { GenericForm } = useGenericForm<ICollegeUnitPayloadForm>({
    inputs: [
      {
        name: 'title',
        defaultValue: '',
        label: t('unit-form.title'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'description',
        defaultValue: '',
        label: t('unit-form.description'),
        type: 'text',
        html: true,
        required: false,
        md: 12,
      },
      {
        name: 'parentId',
        defaultValue: 0,
        type: 'nested-select',
        required: false,
        options: units?.data?.map((unit) => generateNestedItem(unit)) || [],
        isLoading: isLoadingUnits,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default AddCollegeUnitForm;
