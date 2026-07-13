import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IExamPayload } from 'apis/exam/exam.interfaces';

const prepareExamFormData = ({
  data,
  files,
  urlsForRemove,
}: {
  data: IExamPayload;
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

  if (data.collegeSubjectUnitIds?.length) {
    data.collegeSubjectUnitIds?.forEach((unit) => {
      formData.append('collegeSubjectUnitIds', String(unit));
    });
  }

  if (data.gradeSubjectUnitIds?.length) {
    data.gradeSubjectUnitIds?.forEach((unit) => {
      formData.append('GradeSubjectUnitIds', String(unit));
    });
  }

  Object.entries(data)?.forEach(([key, value]) => {
    if (
      value &&
      key !== 'collegeSubjectUnitIds' &&
      key !== 'GradeSubjectUnitIds'
    ) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareExamFormData;
