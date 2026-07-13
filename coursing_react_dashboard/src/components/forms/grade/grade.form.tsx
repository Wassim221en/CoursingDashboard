import { IGrade, IGradePayloadForm } from 'apis/grade/grade.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

function GradeForm({
  onSubmit,
  editItem,
  progress,
  onAbortClick,
}: {
  onSubmit: TSubmitHandler<IGradePayloadForm>;
  editItem: IGrade | null;
  progress: number | undefined;
  onAbortClick?: () => void;
}) {
  const { t } = useTranslation();

  const { GenericForm } = useGenericForm<IGradePayloadForm>({
    inputs: [
      {
        name: 'name',
        defaultValue: editItem?.name || '',
        label: t('grades.name'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'files',
        defaultValue: editItem?.imageUrl
          ? [convertPhotoUrlToFileUploaderFile(editItem.imageUrl)]
          : [],
        label: t('grades.gradeImage'),
        type: 'images',
        required: true,
        limitFileSize: false,
        cropRatio: 16 / 9,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
    progressPercent: progress,
    onAbortClick,
  });

  return GenericForm;
}

export default GradeForm;
