import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IQuestionBankPayload } from 'apis/qusetions/questions.interfaces';

const prepareUploadExcelFormData = ({
  files,
}: {
  data?: IQuestionBankPayload;
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

  return formData;
};
export default prepareUploadExcelFormData;
