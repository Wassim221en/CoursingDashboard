/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import courseQueries from 'apis/course/course.queries';
import { IExam, IExamPayloadForm } from 'apis/exam/exam.interfaces';
import lessonQueries from 'apis/lesson/lesson.queries';
import { TInput } from 'hooks/use-generic-form/types';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useTranslation } from 'react-i18next';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

type Props = {
  onSubmit: TSubmitHandler<IExamPayloadForm>;
  editItem: IExam | null;
};

function CourseQuizForm({ onSubmit, editItem }: Props) {
  const { t } = useTranslation();

  const courseId = useSearchParams('course');

  const { data: lessons, isFetching: isLoadingLessons } =
    lessonQueries.useLessonsQuery({
      courseId: courseId || 0,
    });

  const { data: courses, isLoading: isLoadingCourses } =
    courseQueries.useCoursesQuery({
      courseFilter: 'College',
    });

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
      name: 'examTime',
      defaultValue: editItem?.examTime || '',
      label: t('exams.examTime'),
      type: 'text',
      isDuration: true,
      required: true,
      md: 6,
    },
    {
      name: 'maxMark',
      defaultValue: editItem?.maxMark ?? 0,
      type: 'number',
      max: 600,
      min: 0,
      label: t('courses.quizMark'),
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
      label: t('courses.quizMinMark'),
      required: true,
      md: 6,
    },
    {
      name: 'courseId',
      defaultValue: courseId
        ? {
            id: courseId,
            name: '',
          }
        : editItem?.course?.id
        ? {
            id: editItem?.course?.id,
            name: editItem?.course?.title,
          }
        : null,
      type: 'select',
      label: 'course',
      options:
        courses?.data?.map((item) => ({
          id: item.id,
          name: item.title,
        })) || [],
      isLoading: isLoadingCourses,
      md: 6,
      hidden: !!courseId,
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
      name: 'lessonId',
      defaultValue: editItem?.lesson?.id
        ? {
            id: editItem?.lesson?.id,
            name: editItem?.lesson?.title,
          }
        : null,
      type: 'select',
      label: t('exams.lesson'),
      options:
        lessons?.data?.map((Lesson) => ({
          id: Lesson.id,
          name: Lesson.title,
        })) || [],
      isLoading: isLoadingLessons,
      disabled: !courseId,
      md: 6,
    },
    {
      name: 'files',
      defaultValue:
        editItem?.filesUrl?.map((url) =>
          convertPhotoUrlToFileUploaderFile(url),
        ) || [],
      label: 'files (16:9)',
      type: 'images',
      limitFileSize: false,
      md: 12,
      isMulti: true,
      cropRatio: 16 / 9,
      order: 1000,
    },
  ];

  const { GenericForm } = useGenericForm<IExamPayloadForm>({
    inputs: [...commonInputs],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default CourseQuizForm;
