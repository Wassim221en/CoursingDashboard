import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ISchoolSubjectPayload } from 'apis/school-subject/school-subject.interfaces';

const prepareSchoolSubjectFormData = ({
  data,
  files,
  urlsForRemove,
}: {
  data: ISchoolSubjectPayload;
  files: IFileUploaderFile[];
  urlsForRemove: string[];
}) => {
  const formData = new FormData();
  if (files) {
    files
      ?.filter((file) => !!file.fileObject)
      .forEach((newFile) => {
        formData.append('files', newFile.fileObject!);
      });
  }

  urlsForRemove?.forEach((url) => {
    formData.append('urlsForRemove', url);
  });

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null && key !== 'unitsIds') {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareSchoolSubjectFormData;
