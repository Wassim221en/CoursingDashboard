import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ILessonPayload } from 'apis/lesson/lesson.interfaces';

const prepareLessonFormData = ({
  data,
  files,
  thumbnail,
  urlsForRemove,
}: {
  data: ILessonPayload;
  files: IFileUploaderFile[];
  thumbnail: IFileUploaderFile[];
  urlsForRemove: string[];
}) => {
  const formData = new FormData();
  if (files.length && files[0].fileObject) {
    formData.append('file', files[0].fileObject!);
  }

  if (thumbnail.length && thumbnail[0].fileObject) {
    formData.append('thumbnail', thumbnail[0].fileObject!);
  }

  urlsForRemove?.forEach((url) => {
    formData.append('urlsForRemove', url);
  });

  if (data.goals?.length) {
    data.goals.forEach((goal) =>
      formData.append('goals', JSON.stringify(goal)),
    );
  }

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null && key !== 'goals') {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareLessonFormData;
