import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IGradeSubjectPayload } from 'apis/grade/grade.interfaces';

const prepareGradeSubjectFormData = ({
  data,
  files,
  urlsForRemove,
}: {
  data: IGradeSubjectPayload;
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

  // if (data.units.length)
  //   data.units.forEach((unit) => {
  //     formData.append("units", String(unit));
  //   });

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null && key !== 'units') {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareGradeSubjectFormData;
