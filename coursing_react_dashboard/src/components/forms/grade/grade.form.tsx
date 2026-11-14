import educationalLevelQueries from 'apis/educational-level/educational-level.queries';
import { IGrade, IGradePayloadForm } from 'apis/grade/grade.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

function GradeForm({
  onSubmit,
  editItem,
  defaultEducationLevelId,
  progress,
  onAbortClick,
}: {
  onSubmit: TSubmitHandler<IGradePayloadForm>;
  editItem: IGrade | null;
  /** Pre-selects a level when adding (e.g. the level the list is filtered by). */
  defaultEducationLevelId?: number;
  progress: number | undefined;
  onAbortClick?: () => void;
}) {
  const { t } = useTranslation();
  const { data: educationalLevels, isLoading: isLoadingLevels } =
    educationalLevelQueries.useEducationalLevelsQuery();

  const levelOptions = educationalLevels?.data || [];
  const initialLevelId = editItem
    ? editItem.educationLevelId
    : defaultEducationLevelId;
  const initialLevel =
    levelOptions.find((level) => level.id === initialLevelId) || null;

  // The API can move a grade between levels, but never take it out of one.
  const isLevelLocked = !!editItem?.educationLevelId && !!initialLevel;

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
        name: 'educationLevel',
        defaultValue: initialLevel,
        label: t('grades.educationalLevel'),
        type: 'select',
        options: levelOptions,
        isLoading: isLoadingLevels,
        disableClearable: isLevelLocked,
        md: 6,
      },
      {
        name: 'order',
        defaultValue: editItem?.order ?? ('' as unknown as number),
        label: t('grades.order'),
        type: 'number',
        min: 1,
        helperText: String(t('grades.orderHint')),
        md: 6,
      },
      {
        name: 'files',
        defaultValue: editItem?.imageUrl
          ? [convertPhotoUrlToFileUploaderFile(editItem.imageUrl)]
          : [],
        label: t('grades.gradeImage'),
        type: 'images',
        required: false,
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
