import { ICollegeDetailsSubjectPayloadForm } from 'apis/college-details/college-details.interfaces';
import { ICollegeSubjectDetails } from 'apis/college-subject/college-subject.interfaces';
import collegeSubjectQueries from 'apis/college-subject/college-subject.queries';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

type Props = {
  onSubmit: TSubmitHandler<ICollegeDetailsSubjectPayloadForm>;
  editItem?: ICollegeSubjectDetails | null;
  progress: number | undefined;
  onAbortClick?: () => void;
};

function CollegeDetailsSubjectForm({
  onSubmit,
  editItem,
  progress,
  onAbortClick,
}: Props) {
  const { t } = useTranslation();

  const { data: subjects, isLoading } =
    collegeSubjectQueries.useCollegeSubjectsQuery();
  const { GenericForm } = useGenericForm<ICollegeDetailsSubjectPayloadForm>({
    inputs: [
      {
        name: 'CollegeSubjectId',
        defaultValue: null,
        label: t('subjects.subjects'),
        type: 'select',
        required: !editItem?.id,
        md: 12,
        options: subjects?.data || [],
        isLoading,
        freeSolo: true,
        hidden: !!editItem?.id,
      },
      {
        name: 'AllExamsPrice',
        defaultValue: editItem?.allExamsPrice ?? 0,
        label: t('salesPoints.pointsNumber'),
        type: 'number',
        required: true,
        md: 12,
        isLoading,
      },
      {
        name: 'Description',
        defaultValue: editItem?.description ?? '',
        label: t('lessons.description'),
        html: true,
        type: 'text',
        required: false,
        md: 12,
      },
      {
        name: 'files',
        defaultValue:
          editItem?.filesUrls?.map((file) =>
            convertPhotoUrlToFileUploaderFile(file),
          ) || [],
        label: t('common.image'),
        type: 'images',
        required: true,
        limitFileSize: false,
        md: 12,
      },
    ],
    // : [
    //     {
    //       name: 'CollegeSubjectId',
    //       defaultValue: null,
    //       label: t('subjects.subjects'),
    //       type: 'select',
    //       required: true,
    //       md: 12,
    //       options: subjects?.data || [],
    //       isLoading,
    //       freeSolo: true,
    //     },
    //     // {
    //     //   name: 'AllExamsPrice',
    //     //   defaultValue: null,
    //     //   label: t('salesPoints.pointsNumber'),
    //     //   type: 'number',
    //     //   required: true,
    //     //   md: 12,
    //     //   isLoading,
    //     // },
    //     {
    //       name: 'Description',
    //       html: true,
    //       defaultValue: editItem?.description ?? '',
    //       label: t('lessons.description'),
    //       type: 'text',
    //       required: false,
    //       md: 12,
    //     },
    //     {
    //       name: 'files',
    //       defaultValue:
    //         editItem?.filesUrls?.map((file) =>
    //           convertPhotoUrlToFileUploaderFile(file),
    //         ) || [],
    //       label: t('common.image'),
    //       type: 'images',
    //       required: true,
    //       limitFileSize: false,
    //       md: 12,
    //     },
    //   ],
    onSubmit: (data) => onSubmit(data),
    progressPercent: progress,
    onAbortClick,
  });

  return GenericForm;
}

export default CollegeDetailsSubjectForm;
