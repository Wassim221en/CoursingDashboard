import {
  IInstructorCertificate,
  IInstructorCertificatePayloadForm,
} from 'apis/instructor/instructor.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

type Props = {
  onSubmit: TSubmitHandler<IInstructorCertificatePayloadForm>;
  editItem: IInstructorCertificate | null;
};

function InstructorCertificateForm({ onSubmit, editItem }: Props) {
  const { t } = useTranslation();

  const { GenericForm } = useGenericForm<IInstructorCertificatePayloadForm>({
    inputs: [
      {
        name: 'name',
        defaultValue: editItem?.name || '',
        label: String(t('universities.name')),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'date',
        defaultValue: editItem?.date ? editItem.date.toString() : null,
        label: String(t('news.date')),
        type: 'date',
        required: false,
        md: 12,
      },
      {
        name: 'source',
        defaultValue: editItem?.source || '',
        label: String(t('instructors.certificateSource')),
        type: 'text',
        required: false,
        md: 12,
      },
      {
        name: 'files',
        defaultValue: editItem?.fileUrl
          ? [convertPhotoUrlToFileUploaderFile(editItem?.fileUrl)]
          : [],
        label: 'Certification file image ratio 16:9',
        type: 'all',
        required: true,
        limitFileSize: false,
        cropRatio: 16 / 9,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default InstructorCertificateForm;
