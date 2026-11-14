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

  // Optional fields (educationLevelId / order) must be left out entirely when
  // empty: the backend rejects order = 0 and treats a missing order as "last".
  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareGradeFormData;
