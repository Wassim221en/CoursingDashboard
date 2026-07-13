import { IFileUploaderFile } from "@craft-code/file-uploader";
import { ICoursePayload } from "apis/course/course.interfaces";

const prepareCourseFormData = ({
  data,
  files,
}: {
  data: ICoursePayload;
  files: IFileUploaderFile[];
}) => {
  const formData = new FormData();
  if (files) {
    files
      ?.filter((file) => !!file.fileObject)
      .forEach((newFile) => {
        formData.append("coverFile", newFile.fileObject!);
      });
  }

  data.instructorsIds.forEach((instructor) => {
    formData.append("instructorsIds", String(instructor));
  });

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null && key !== "instructorsIds") {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareCourseFormData;
