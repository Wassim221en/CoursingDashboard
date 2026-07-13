import {
  ICollegeSubjectDetails,
  ICollegeSubjectPayloadForm,
} from 'apis/college-subject/college-subject.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

type Props = {
  onSubmit: TSubmitHandler<ICollegeSubjectPayloadForm>;
  editItem?: ICollegeSubjectDetails | null;
};

function CollegeSubjectForm({ onSubmit, editItem }: Props) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<ICollegeSubjectPayloadForm>({
    inputs: [
      {
        name: 'name',
        defaultValue: editItem?.name || '',
        label: t('subjects.subjectName'),
        type: 'text',
        required: true,
        md: 12,
      },
      // {
      //   name: "files",
      //   defaultValue:
      //     editItem?.filesUrls.map((url) =>
      //       convertPhotoUrlToFileUploaderFile(url)
      //     ) || [],
      //   label: "Subject Images",
      //   type: "images",
      //   required: false,
      //   md: 12,
      // },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default CollegeSubjectForm;
