import cityQueries from 'apis/city/city.queries';
import {
  IUniversityDetails,
  IUniversityPayloadForm,
} from 'apis/university/university.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

function UniversityForm({
  onSubmit,
  editItem,
  progress,
  onAbortClick,
}: {
  onSubmit: TSubmitHandler<IUniversityPayloadForm>;
  editItem: IUniversityDetails | null;
  progress: number | undefined;
  onAbortClick?: () => void;
}) {
  const { t } = useTranslation();
  const { data: cities, isLoading } = cityQueries.useCitiesQuery();

  const { GenericForm } = useGenericForm<IUniversityPayloadForm>({
    inputs: [
      {
        name: 'name',
        defaultValue: editItem?.name || '',
        label: t('university-form.name'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'cityIds',
        defaultValue: editItem?.cities ?? [],
        label: t('university-form.cities'),
        type: 'select',
        required: true,
        md: 12,
        isLoading,
        options: cities?.data || [],
        isMulti: true,
      },
      {
        name: 'files',
        defaultValue:
          editItem?.filesUrls.map((url) =>
            convertPhotoUrlToFileUploaderFile(url),
          ) || [],
        label: t('common.image'),
        type: 'images',
        limitFileSize: false,
        // required: true,
        md: 12,
        cropRatio: 1,
      },
    ],
    onSubmit: (data) => onSubmit(data),
    progressPercent: progress,
    onAbortClick,
  });

  return GenericForm;
}

export default UniversityForm;
