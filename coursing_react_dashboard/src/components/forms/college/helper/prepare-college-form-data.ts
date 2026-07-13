import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ICollegePayload } from 'apis/college/college.interfaces';

const prepareCollegeFormData = ({
  data,
  files,
  urlsForRemove,
}: {
  data: ICollegePayload;
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
    if (value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareCollegeFormData;
