import {
  IGradeSubjectPayloadForm,
  IGradeSubjectDetails,
} from 'apis/grade/grade.interfaces';
import schoolSubjectQueries from 'apis/school-subject/school-subject.queries';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

type Props = {
  onSubmit: TSubmitHandler<IGradeSubjectPayloadForm>;
  editItem?: IGradeSubjectDetails | null;
  progress: number | undefined;
  onAbortClick?: () => void;
};

function GradeSubjectForm({
  onSubmit,
  editItem,
  progress,
  onAbortClick,
}: Props) {
  const { t } = useTranslation();
  const { data: subjects, isLoading } =
    schoolSubjectQueries.useSchoolSubjectsQuery();

  // const { data: units = [], isLoading: isLoadingUnits } =
  //   schoolUnitQueries.useSchoolUnitsQuery();
  const { GenericForm } = useGenericForm<IGradeSubjectPayloadForm>({
    inputs: [
      {
        name: 'schoolSubjectId',
        defaultValue: editItem?.subject
          ? { id: editItem.subject.id, name: editItem.subject.name }
          : null,
        label: t('subjects.subject'),
        type: 'select',
        required: true,
        md: 12,
        options: subjects?.data || [],
        isLoading,
      },
      {
        name: 'AllExamsPrice',
        defaultValue: editItem?.allExamsPrice ?? 0,
        label: t('salesPoints.pointsNumber'),
        type: 'number',
        required: true,
        md: 12,
        // options: subjects?.data || [],
        isLoading,
      },
      // {
      //   name: "units",
      //   defaultValue:
      //     editItem?.units.map((unit) => ({
      //       id: unit.id,
      //       name: unit.title,
      //     })) || [],
      //   label: "Units",
      //   type: "select",
      //   required: false,
      //   md: 12,
      //   options: units.map((unit) => ({
      //     id: unit.id,
      //     name: unit.title,
      //   })),
      //   isLoading: isLoadingUnits,
      //   isMulti: true,
      // },
      {
        name: 'description',
        defaultValue: editItem?.description || '',
        label: t('grades.description'),
        type: 'text',
        required: true,
        md: 12,
        html: true,
      },
      {
        name: 'files',
        defaultValue:
          editItem?.filesUrls.map((url) =>
            convertPhotoUrlToFileUploaderFile(url),
          ) || [],
        label: t('salesPoints.grade-subject-images'),
        type: 'images',
        required: true,
        limitFileSize: false,
        md: 12,
        cropRatio: 16 / 9,
      },
    ],
    onSubmit: (data) => onSubmit(data),
    progressPercent: progress,
    onAbortClick,
  });

  return GenericForm;
}

export default GradeSubjectForm;
