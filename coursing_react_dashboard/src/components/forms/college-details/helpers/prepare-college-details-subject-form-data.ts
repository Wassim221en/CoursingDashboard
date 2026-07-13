import { IFileUploaderFile } from "@craft-code/file-uploader";
import { ICollegeDetailsSubjectPayload } from "apis/college-details/college-details.interfaces";

const prepareCollegeDetailsFormData = ({
  data,
  files,
  urlsForRemove,
}: {
  data: ICollegeDetailsSubjectPayload;
  files: IFileUploaderFile[];
  urlsForRemove: string[];
}) => {
  const formData = new FormData();
  if (files) {
    files
      ?.filter((file) => !!file.fileObject)
      .forEach((newFile) => {
        formData.append("Files", newFile.fileObject!);
      });
  }

  urlsForRemove?.forEach((url) => {
    formData.append("UrlsForRemove", url);
  });

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareCollegeDetailsFormData;
