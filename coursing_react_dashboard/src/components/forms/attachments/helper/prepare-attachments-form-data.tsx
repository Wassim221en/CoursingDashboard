import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IAttachmentsPayload } from 'apis/attachments/attachments.interfaces';

const prepareAttachmentsFormData = ({
  data,
  files,
}: {
  data: IAttachmentsPayload;
  files: IFileUploaderFile[];
}) => {
  const formData = new FormData();
  if (files) {
    files
      ?.filter((file) => !!file.fileObject)
      .forEach((newFile) => {
        formData.append('file', newFile.fileObject!);
      });
  }

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareAttachmentsFormData;
