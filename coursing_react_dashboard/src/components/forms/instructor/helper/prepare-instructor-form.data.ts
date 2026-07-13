import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IActionInstructorPayload } from 'apis/instructor/instructor.interfaces';

const prepareInstructorFormData = ({
  data: {
    CollegeDetailsSubjectIds,
    colleges,
    university,
    GradeSubjectIds,
    grade,
    Type,
    ...data
  },
  files,
  urlsForRemove,
}: {
  data: IActionInstructorPayload;
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

  if (Type) formData.append('Type', Type.id.toString());
  urlsForRemove?.forEach((url) => {
    formData.append('urlsForRemove', url);
  });
  CollegeDetailsSubjectIds?.forEach((subject) => {
    formData.append('CollegeDetailsSubjectIds', subject.id.toString());
  });
  data = {
    ...data,
    birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : '',
  };
  GradeSubjectIds?.forEach((subject) => {
    formData.append('GradeSubjectIds', subject.id.toString());
  });

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareInstructorFormData;
