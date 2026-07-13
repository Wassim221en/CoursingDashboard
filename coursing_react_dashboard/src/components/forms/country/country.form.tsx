import { ICountry, ICountryPayload } from 'apis/country/country.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

function CountryForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<ICountryPayload>;
  editItem: ICountry | null;
}) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<ICountryPayload>({
    inputs: [
      {
        name: 'name',
        defaultValue: editItem?.name || '',
        label: t('countries.countryName'),
        type: 'text',
        required: true,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default CountryForm;
