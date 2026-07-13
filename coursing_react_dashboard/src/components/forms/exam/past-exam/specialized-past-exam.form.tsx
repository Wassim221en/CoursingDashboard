/* eslint-disable react-hooks/exhaustive-deps */
import { ICourse } from 'apis/course/course.interfaces';
import { IExam, IExamPayloadForm } from 'apis/exam/exam.interfaces';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import { ISpecialized } from 'apis/specialized/specialized.interfaces';
import { TAutoComplete, TInput } from 'hooks/use-generic-form/types';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

type Props = {
  onSubmit: TSubmitHandler<IExamPayloadForm>;
  editItem: IExam | null;
  courses: ICourse[];
  isLoadingCourses: boolean;
  lessons: ILesson[];
  isLoadingLessons: boolean;
  courseId: TAutoComplete | null;
  setCourse: React.Dispatch<React.SetStateAction<TAutoComplete | null>>;
  isLoadingSpecialized: boolean;
  specialized: ISpecialized[];
};

function SpecializedPastExamForm({
  onSubmit,
  editItem,
  courses,
  isLoadingCourses,
  lessons,
  isLoadingLessons,
  courseId,
  setCourse,
  isLoadingSpecialized,
  specialized,
}: Props) {
  const { t } = useTranslation();

  const commonInputs: TInput<IExamPayloadForm>[] = [
    {
      name: 'title',
      defaultValue: editItem?.title || '',
      label: t('exams.title'),
      type: 'text',
      required: true,
      md: 6,
    },
    {
      name: 'maxMark',
      defaultValue: editItem?.maxMark ?? 0,
      type: 'number',
      max: 600,
      min: 0,
      label: t('exams.maxMark'),
      required: true,
      moreThan: 'minMark',
      md: 6,
    },
    {
      name: 'minMark',
      defaultValue: editItem?.minMark ?? 0,
      type: 'number',
      max: 600,
      min: 0,
      label: t('exams.minMark'),
      required: true,
      md: 6,
    },
    {
      name: 'examTime',
      defaultValue: editItem?.examTime || '',
      label: t('exams.examTime'),
      type: 'text',
      isDuration: true,
      required: true,
      md: 6,
    },
    {
      name: 'points',
      defaultValue: editItem?.points || 0,
      type: 'number',
      min: 0,
      label: t('courses.points'),
      required: true,
      md: 6,
    },

    {
      name: 'courseId',
      defaultValue: editItem?.course?.id
        ? {
            id: editItem?.course?.id,
            name: editItem?.course?.title,
          }
        : null,
      type: 'select',
      label: t('exams.course'),
      options: courses.map((course) => ({
        id: course.id,
        name: course.title,
      })),
      isLoading: isLoadingCourses,
      md: 6,
      onChange: (val) => setCourse(val),
    },
    {
      name: 'lessonId',
      defaultValue: editItem?.lesson?.id
        ? {
            id: editItem?.lesson?.id,
            name: editItem?.lesson?.title,
          }
        : null,
      type: 'select',
      label: t('exams.lesson'),
      options: lessons.map((lesson) => ({
        id: lesson.id,
        name: lesson.title,
      })),
      isLoading: isLoadingLessons,
      disabled: !courseId,
      md: 6,
    },
    {
      name: 'files',
      defaultValue:
        editItem?.filesUrl.map((url) =>
          convertPhotoUrlToFileUploaderFile(url),
        ) || [],
      label: t('common.image'),
      type: 'images',
      limitFileSize: false,
      md: 12,
      cropRatio: 1,
      isMulti: true,
    },
  ];

  const specializedIdInputs: TInput<IExamPayloadForm>[] = [
    {
      name: 'specializedId',
      defaultValue: editItem?.specialized?.id || 0,
      type: 'nested-select',
      options: specialized,
      isLoading: isLoadingSpecialized,
      label: String(t('exams.unit')),
      md: 12,
    },
  ];

  const { GenericForm } = useGenericForm<IExamPayloadForm>({
    inputs: [...commonInputs, ...specializedIdInputs],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default SpecializedPastExamForm;
