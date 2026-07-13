import {
  ISchoolSubjectDetails,
  ISchoolSubjectPayload,
} from 'apis/school-subject/school-subject.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

type Props = {
  onSubmit: TSubmitHandler<ISchoolSubjectPayload>;
  editItem?: ISchoolSubjectDetails | null;
};

function SchoolSubjectForm({ onSubmit, editItem }: Props) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<ISchoolSubjectPayload>({
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
      //   required: true,
      //   md: 12,
      // },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default SchoolSubjectForm;
