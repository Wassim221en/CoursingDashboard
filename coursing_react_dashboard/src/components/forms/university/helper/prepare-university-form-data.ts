import { IFileUploaderFile } from "@craft-code/file-uploader";
import { IUniversityPayload } from "apis/university/university.interfaces";

const prepareUniversityFormData = ({
  data,
  files,
  urlsForRemove,
}: {
  data: IUniversityPayload;
  files: IFileUploaderFile[];
  urlsForRemove: string[];
}) => {
  const formData = new FormData();
  if (files) {
    files
      ?.filter((file) => !!file.fileObject)
      .forEach((newFile) => {
        formData.append("files", newFile.fileObject!);
      });
  }

  urlsForRemove?.forEach((url) => {
    formData.append("urlsForRemove", url);
  });

  data.cityIds.forEach((city) => {
    formData.append("cityIds", String(city));
  });

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null && key !== "cityIds") {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareUniversityFormData;
