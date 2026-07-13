import { ICollegeDetailsPayload } from 'apis/college-details/college-details.interfaces';

const prepareCollegeDetailsFormData = ({
  data,
}: // files,
// urlsForRemove,
{
  data: ICollegeDetailsPayload;
  // files: IFileUploaderFile[];
  // urlsForRemove: string[];
}) => {
  const formData = new FormData();
  // if (files) {
  //   files
  //     ?.filter((file) => !!file.fileObject)
  //     .forEach((newFile) => {
  //       formData.append("files", newFile.fileObject!);
  //     });
  // }

  // urlsForRemove?.forEach((url) => {
  //   formData.append("urlsForRemove", url);
  // });

  if (data.collegeSubjectIds.length) {
    data.collegeSubjectIds.forEach((c) => {
      formData.append('collegeSubjectIds', String(c));
    });
  }

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null && key !== 'collegeSubjectIds') {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareCollegeDetailsFormData;
