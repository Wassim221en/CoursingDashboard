import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ISpecializedPayload } from 'apis/specialized/specialized.interfaces';

const prepareSpecializedFormData = ({
  data,
  files,
  urlsForRemove,
}: {
  data: ISpecializedPayload;
  files: IFileUploaderFile[];
  urlsForRemove?: string[];
}) => {
  const formData = new FormData();
  if (files) {
    files
      ?.filter((file) => !!file.fileObject)
      .forEach((newFile) => {
        formData.append('Files', newFile.fileObject!);
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
export default prepareSpecializedFormData;
