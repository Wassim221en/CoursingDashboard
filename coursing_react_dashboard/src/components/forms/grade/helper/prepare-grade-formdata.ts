import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IGradePayload } from 'apis/grade/grade.interfaces';

const prepareGradeFormData = ({
  data,
  files,
  urlsForRemove,
}: {
  data: IGradePayload;
  files: IFileUploaderFile[];
  urlsForRemove: string[];
}) => {
  const formData = new FormData();
  if (files) {
    files
      ?.filter((file) => !!file.fileObject)
      .forEach((newFile) => {
        formData.append('ImageFile', newFile.fileObject!);
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
export default prepareGradeFormData;
