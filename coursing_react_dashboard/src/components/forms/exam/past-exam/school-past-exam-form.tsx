/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { ICourse } from 'apis/course/course.interfaces';
import { IExam, IExamPayloadForm } from 'apis/exam/exam.interfaces';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import { ISchoolSubject } from 'apis/school-subject/school-subject.interfaces';
import { ISchoolUnit } from 'apis/school-unit/school-unit.interfaces';
import { TAutoComplete, TInput } from 'hooks/use-generic-form/types';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useEffect, useState } from 'react';
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
  schoolSubjects: ISchoolSubject[];
  isLoadingSchoolSubjects: boolean;
  schoolSubjectsUnits: ISchoolUnit[];
  isLoadingSchoolSubjectsUnits: boolean;
  schoolSubjectId: TAutoComplete | null;
  setCourse: React.Dispatch<React.SetStateAction<TAutoComplete | null>>;
  setSchoolSubject: React.Dispatch<React.SetStateAction<TAutoComplete | null>>;
};

function SchoolpastExamForm({
  onSubmit,
  editItem,
  courses,
  isLoadingCourses,
  lessons,
  isLoadingLessons,
  courseId,
  schoolSubjects,
  isLoadingSchoolSubjects,
  schoolSubjectsUnits,
  isLoadingSchoolSubjectsUnits,
  setCourse,
  schoolSubjectId,
  setSchoolSubject,
}: Props) {
  const { t } = useTranslation();
  const [disableCourse, setDisableCourse] = useState(false);
  const [disableSubject, setDisableSubject] = useState(false);
  const subjectId = useSearchParams('subject');

  useEffect(() => {
    if (subjectId)
      setSchoolSubject({
        id: subjectId,
        name: '',
      });
  }, []);

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
      disabled: disableCourse,
      hidden: !!subjectId,
      onChange: (val) => {
        setCourse(val);
        if (val) setDisableSubject(true);
        else setDisableSubject(false);
      },
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
      disabled: !courseId || !!schoolSubjectId?.id,
      md: 6,
      hidden: !!subjectId,
    },
    {
      name: 'files',
      defaultValue:
        editItem?.filesUrl?.map((url) =>
          convertPhotoUrlToFileUploaderFile(url),
        ) || [],
      label: 'files',
      type: 'images',
      limitFileSize: false,
      md: 12,
      isMulti: true,
      cropRatio: 1,
      order: 1000,
    },
  ];

  const schoolInputs: TInput<IExamPayloadForm>[] = [
    {
      name: 'gradeSubjectId',
      defaultValue: subjectId
        ? {
            id: subjectId,
            name: '',
          }
        : editItem?.gradeSubject?.id
        ? {
            id: editItem?.gradeSubject?.id,
            name: editItem?.gradeSubject?.name,
          }
        : null,
      type: 'select',
      options: schoolSubjects,
      isLoading: isLoadingSchoolSubjects,
      label: t('exams.subject'),
      md: 6,
      disabled: disableSubject,
      hidden: !!subjectId,
      onChange: (val) => {
        setSchoolSubject(val as TAutoComplete);
        if (val) setDisableCourse(true);
        else setDisableCourse(false);
      },
    },
    {
      name: 'gradeSubjectUnitIds',
      defaultValue: editItem?.gradeSubjectUnit
        ? editItem.gradeSubjectUnit.map((unit) => ({
            id: unit.id,
            name: unit.title,
          }))
        : [],
      type: 'select',
      options: schoolSubjectsUnits.map((unit) => ({
        id: unit.id,
        name: unit.title,
      })),
      isLoading: isLoadingSchoolSubjectsUnits,
      label: t('exams.unit'),
      disabled: !schoolSubjectId,
      md: 6,
      isMulti: true,
    },
  ];

  const { GenericForm } = useGenericForm<IExamPayloadForm>({
    inputs: [...commonInputs, ...schoolInputs],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default SchoolpastExamForm;
