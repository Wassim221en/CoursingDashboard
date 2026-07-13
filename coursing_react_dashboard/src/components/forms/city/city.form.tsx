import { ICity, ICityPayloadForm } from 'apis/city/city.interfaces';
import countryQueries from 'apis/country/country.queries';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

function CityForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<ICityPayloadForm>;
  editItem: ICity | null;
}) {
  const { data: countries, isLoading } = countryQueries.useCountriesQuery();
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<ICityPayloadForm>({
    inputs: [
      {
        name: 'name',
        defaultValue: editItem?.name || '',
        label: t('cities.cityName'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'countryId',
        defaultValue: editItem?.country || null,
        label: t('cities.country'),
        type: 'select',
        required: true,
        md: 12,
        isLoading,
        options: countries?.data || [],
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default CityForm;
