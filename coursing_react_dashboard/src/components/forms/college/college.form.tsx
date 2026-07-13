import { ICollege, ICollegePayloadForm } from 'apis/college/college.interfaces';
import universityQueries from 'apis/university/university.queries';
import { getNameById } from 'hooks/use-generic-form/helpers';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

function CollegeForm({
  onSubmit,
  editItem,
  universityId,
  progress,
  onAbortClick,
}: {
  onSubmit: TSubmitHandler<ICollegePayloadForm>;
  editItem: ICollege | null;
  universityId?: number;
  progress: number | undefined;
  onAbortClick?: () => void;
}) {
  const { t } = useTranslation();

  const { data: universities, isLoading } =
    universityQueries.useUniversitiesQuery();

  const universityID = universityId || editItem?.university.id;
  const universityName = universityId
    ? getNameById(universities?.data || [], String(universityId))
    : editItem?.university.name || '';

  const { GenericForm } = useGenericForm<ICollegePayloadForm>({
    inputs: [
      {
        name: 'collegeName',
        defaultValue: editItem?.name || '',
        label: t('college-form.name'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'universityId',
        defaultValue: universityID
          ? {
              id: universityID,
              name: universityName,
            }
          : null,
        label: t('college-form.university'),
        type: 'select',
        required: true,
        md: 12,
        isLoading,
        options:
          universities?.data?.map((university) => ({
            id: university.id,
            name: university.name,
          })) || [],
        disabled: !!universityId,
        hidden: !!universityId,
      },

      {
        name: 'files',
        defaultValue:
          editItem?.filesUrl.map((url) =>
            convertPhotoUrlToFileUploaderFile(url),
          ) || [],
        label: t('common.image'),
        type: 'images',
        // required: true,
        limitFileSize: false,
        cropRatio: 1,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
    progressPercent: progress,
    onAbortClick,
  });

  return GenericForm;
}

export default CollegeForm;
