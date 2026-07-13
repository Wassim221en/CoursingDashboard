import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IGraduationProjectPayload } from 'apis/graduation-project/graduation-project.interfaces';

const prepareGraduationProjectFormData = ({
  data,
  files,
  urlsForRemove,
}: {
  data: IGraduationProjectPayload;
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

  if (urlsForRemove.length) {
    urlsForRemove.forEach((url) => formData.append('urlsForRemove', url));
  }

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareGraduationProjectFormData;
