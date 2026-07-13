import {
  ICollegeDetails,
  ICollegeDetailsPayloadForm,
} from 'apis/college-details/college-details.interfaces';
import semesterQueries from 'apis/semester/semester.queries';
import { Years } from 'constants/constants';
import { getNameById } from 'hooks/use-generic-form/helpers';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

type Props = {
  onSubmit: TSubmitHandler<ICollegeDetailsPayloadForm>;
  editItem?: ICollegeDetails | null;
  collegeId: number;
};

function CollegeDetailsForm({ onSubmit, editItem, collegeId }: Props) {
  const { data: semesters, isLoading } = semesterQueries.useSemestersQuery();

  const { t } = useTranslation();

  const yearId = editItem?.year;

  const { GenericForm } = useGenericForm<ICollegeDetailsPayloadForm>({
    inputs: [
      {
        name: 'year',
        defaultValue: yearId
          ? {
              id: yearId,
              name: t(getNameById(Years, String(yearId))),
            }
          : null,
        label: t('college-details-form.year'),
        type: 'select',
        required: true,
        md: 12,
        options: Years.map((y) => ({
          id: y.id,
          name: t(y.name),
        })),
      },
      {
        name: 'semesterId',
        defaultValue: editItem?.semester || null,
        label: t('college-details-form.semester'),
        type: 'select',
        required: false,
        md: 12,
        isLoading,
        options:
          semesters?.data.map((semester) => ({
            id: semester.id,
            name: semester.name,
          })) || [],
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default CollegeDetailsForm;
