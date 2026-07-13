import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IQuestionBankPayload } from 'apis/qusetions/questions.interfaces';

const prepareBankQuestionFormData = ({
  data,
  files,
}: {
  data: IQuestionBankPayload;
  files: IFileUploaderFile[];
}) => {
  const formData = new FormData();
  if (files) {
    files
      ?.filter((file) => !!file.fileObject)
      .forEach((newFile) => {
        formData.append('Image', newFile.fileObject!);
      });
  }
  if (data.tags) {
    data.tags
      .map((tag) => ({
        id: 0,
        name: tag.name,
      }))
      .forEach((tag) => {
        formData.append('tags', JSON.stringify({ name: tag.name, id: tag.id }));
      });
  }
  data.gradeSubjectUnitIds?.forEach((id) => {
    formData.append(
      'gradeSubjectUnitIds',
      JSON.stringify(id),
      // JSON.stringify({ collegeSubjectUnitIds: id }),
    );
  });
  data.collegeDetailsSubjectUnitIds?.forEach((id) => {
    formData.append(
      'collegeDetailsSubjectUnitIds',

      String(id),
    );
  });
  data.choices?.forEach((choices) => {
    formData.append(
      'choices',
      JSON.stringify({
        title: choices.title,
        theTrueAnswer: choices.theTrueAnswer,
      }),
    );
  });

  Object.entries(data)?.forEach(([key, value]) => {
    if (
      value !== null &&
      ![
        'gradeSubjectUnitIds',
        'tags',
        'choices',
        'collegeSubjectUnitIds',
        'collegeDetailsSubjectUnitIds',
      ].includes(key)
    ) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
const prepareBankQuestionFormDataImage = ({
  id,
  files,
}: {
  id: number;
  files: IFileUploaderFile[];
}) => {
  const formData = new FormData();
  if (files) {
    files
      ?.filter((file) => !!file.fileObject)
      .forEach((newFile) => {
        formData.append('Image', newFile.fileObject!);
      });
  }
  formData.append('id', id.toString());

  return formData;
};
const prepareBankQuestion = {
  prepareBankQuestionFormData,
  prepareBankQuestionFormDataImage,
};
export default prepareBankQuestion;
