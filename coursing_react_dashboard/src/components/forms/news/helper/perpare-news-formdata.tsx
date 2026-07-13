import { IFileUploaderFile } from '@craft-code/file-uploader';
import { INewsPayload } from 'apis/news/news.interfaces';

const prepareNewsFormData = ({
  data,
  files,
  urlsForRemove,
}: {
  data: INewsPayload;
  files: IFileUploaderFile[];
  urlsForRemove?: string[];
}) => {
  const formData = new FormData();
  if (files) {
    files
      ?.filter((file) => !!file.fileObject)
      .forEach((newFile) => {
        formData.append('ImageFile', newFile.fileObject!);
      });
  }

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null) {
      formData.append(key, String(value));
    }
  });

  urlsForRemove?.forEach((url) => {
    formData.append('urlsForRemove', url);
  });

  return formData;
};
export default prepareNewsFormData;
