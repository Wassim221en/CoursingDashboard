import {
  ISpecialized,
  ISpecializedPayloadForm,
} from 'apis/specialized/specialized.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

function SpecializedForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<ISpecializedPayloadForm>;
  editItem: ISpecialized | null;
}) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<ISpecializedPayloadForm>({
    inputs: [
      {
        name: 'name',
        defaultValue: editItem?.name || '',
        label: t('specialized.specialized'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'files',
        defaultValue: editItem?.fileUrl
          ? [convertPhotoUrlToFileUploaderFile(editItem.fileUrl)]
          : [],
        label: 'image',
        type: 'images',
        required: true,
        md: 12,
        cropRatio: 1,
        limitFileSize: false,
        order: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default SpecializedForm;
