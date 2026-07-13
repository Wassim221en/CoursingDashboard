/* eslint-disable @typescript-eslint/naming-convention */
import cityQueries from 'apis/city/city.queries';
import {
  ISalesPoint,
  ISalesPointPayloadForm,
} from 'apis/sales-point/sales-point.interfaces';
import { getNameById } from 'hooks/use-generic-form/helpers';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import { getDateFromObject } from 'utils/helpers';

type Props = {
  onSubmit: TSubmitHandler<ISalesPointPayloadForm>;
  editItem?: ISalesPoint | null;
  cityId: number;
};

function SalesPointForm({ onSubmit, editItem, cityId }: Props) {
  const { t } = useTranslation();
  const { data: cities, isLoading: isLoadingCities } =
    cityQueries.useCitiesQuery();

  const _cityId = cityId || editItem?.cityId;

  const { GenericForm } = useGenericForm<ISalesPointPayloadForm>({
    inputs: [
      {
        name: 'name',
        defaultValue: editItem?.name || '',
        label: t('salesPoints.name'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'address',
        defaultValue: editItem?.address || '',
        label: t('salesPoints.address'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'timeOfOpen',
        defaultValue: editItem?.timeOfOpen
          ? getDateFromObject(editItem.timeOfOpen)
          : null,
        label: t('salesPoints.timeOfOpen'),
        type: 'date',
        isTime: true,
        md: 12,
      },
      {
        name: 'timeOfClose',
        defaultValue: editItem?.timeOfClose
          ? getDateFromObject(editItem.timeOfClose)
          : null,
        label: t('salesPoints.timeOfClose'),
        type: 'date',
        isTime: true,
        md: 12,
      },
      {
        name: 'city',
        defaultValue: _cityId
          ? {
              id: _cityId,
              name:
                editItem?.city ||
                getNameById(
                  cities?.data?.map((c) => ({
                    id: c.id,
                    name: c.name,
                  })) || [],
                  String(_cityId),
                ),
            }
          : null,
        label: t('salesPoints.city'),
        md: 12,
        type: 'select',
        required: true,
        options:
          cities?.data?.map((city) => ({
            id: city?.id,
            name: city?.name,
          })) || [],
        isLoading: isLoadingCities,
        disabled: !!cityId,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default SalesPointForm;
