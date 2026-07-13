import { IFileUploaderFile } from '@craft-code/file-uploader';
import {
  IInstructorCertificatePayload,
  IInstructorCertificatePayloadForm,
} from 'apis/instructor/instructor.interfaces';

const prepareInstructorCertificateFormData = ({
  data,
  files,
}: {
  data: IInstructorCertificatePayloadForm;
  files: IFileUploaderFile[];
}) => {
  const formData = new FormData();

  if (files.length && files[0].fileObject) {
    formData.append('file', files[0].fileObject!);
  }

  const payloadForm: IInstructorCertificatePayload = {
    ...data,
    date: new Date(data.date).toISOString(),
  };

  Object.entries(payloadForm)?.forEach(([key, value]) => {
    if (value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareInstructorCertificateFormData;
