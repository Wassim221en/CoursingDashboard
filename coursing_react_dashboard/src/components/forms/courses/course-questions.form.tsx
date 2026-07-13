import {
  ICourseQuestion,
  ICourseQuestionPayload,
} from 'apis/course/course.interfaces';
import {} from 'apis/faq/faq.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';

function CourseQuestionsForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<ICourseQuestionPayload>;
  editItem: ICourseQuestion | null;
}) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<ICourseQuestionPayload>({
    inputs: [
      {
        name: 'answer',
        defaultValue: '',
        label: t('questionsBank.answers'),
        type: 'text',
        required: true,
        md: 12,
        html: true,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default CourseQuestionsForm;
