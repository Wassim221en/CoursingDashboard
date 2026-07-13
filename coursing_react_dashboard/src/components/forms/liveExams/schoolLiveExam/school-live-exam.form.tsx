/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { ICourse } from 'apis/course/course.interfaces';
import { IExam, IExamPayloadForm } from 'apis/exam/exam.interfaces';
import gradeQueries from 'apis/grade/grade.queries';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import { ISchoolUnit } from 'apis/school-unit/school-unit.interfaces';
import { TAutoComplete, TInput } from 'hooks/use-generic-form/types';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  convertPhotoUrlToFileUploaderFile,
  convertUtcDateToLocaleDate,
} from 'utils/helpers';

type Props = {
  onSubmit: TSubmitHandler<IExamPayloadForm>;
  editItem: IExam | null;
  courses: ICourse[];
  isLoadingCourses: boolean;
  lessons: ILesson[];
  isLoadingLessons: boolean;
  courseId: TAutoComplete | null;
  GradeSubjectsUnits: ISchoolUnit[];
  isLoadingSchoolSubjectsUnits: boolean;
  gradeSubjectId: TAutoComplete | null;
  setCourse: React.Dispatch<React.SetStateAction<TAutoComplete | null>>;
  setGradeSubject: React.Dispatch<React.SetStateAction<TAutoComplete | null>>;
};

function SchoolLiveExamForm({
  onSubmit,
  editItem,
  courses,
  isLoadingCourses,
  lessons,
  isLoadingLessons,
  courseId,
  GradeSubjectsUnits,
  isLoadingSchoolSubjectsUnits,
  setCourse,
  gradeSubjectId,
  setGradeSubject,
}: Props) {
  const { t } = useTranslation();

  const [disableCourse, setDisableCourse] = useState(false);
  const [disableSubject, setDisableSubject] = useState(false);
  const [gradeId, setGradeId] = useState<number>();

  const subjectId = useSearchParams('subject');

  const { data: grades, isLoading } = gradeQueries.useGradesQuery();

  const { data: gradeSubjects, isLoading: isLoadingGradeSubjects } =
    gradeQueries.useGradeSubjectsQuery({ gradeId }, !gradeId);

  useEffect(() => {
    if (subjectId)
      setGradeSubject({
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
      defaultValue: Number(editItem?.examTime) || 0,
      label: t('exams.examTime'),
      type: 'number',
      required: true,
      // isDuration: true,
      md: 6,
    },
    {
      name: 'examLiveDate',
      defaultValue: editItem?.examLiveDate
        ? convertUtcDateToLocaleDate(editItem.examLiveDate)
        : null,
      label: t('exams.examLiveDate'),
      type: 'date',
      isDateAndTime: true,
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
      disabled: !courseId || !!gradeSubjectId?.id,
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
      required: true,
      md: 12,
      isMulti: true,
      cropRatio: 1,
      order: 1000,
    },
  ];

  const schoolInputs: TInput<IExamPayloadForm>[] = [
    {
      name: 'gradesId',
      defaultValue: null,
      label: t('schooling.grades'),
      type: 'select',
      md: 6,
      options: grades?.data || [],
      isLoading,
      onChange(val) {
        setGradeId(val?.id);
      },
      hidden: !!subjectId,
    },
    {
      name: 'gradeSubjectId',
      defaultValue: subjectId
        ? {
            id: subjectId,
            name: '',
          }
        : editItem?.courseId
        ? null
        : editItem?.gradeSubject?.id
        ? {
            id: editItem?.gradeSubject?.id,
            name: editItem?.gradeSubject?.name,
          }
        : null,
      type: 'select',
      options:
        gradeSubjects?.data.map((subject) => ({
          id: subject.id,
          name: subject.subject.name,
        })) || [],
      isLoading: !!isLoadingGradeSubjects && !!disableSubject,
      label: t('exams.subject'),
      md: 6,
      disabled: !gradeId,
      hidden: !!subjectId,
      onChange: (val) => {
        setGradeSubject(val);
        if (val) setDisableCourse(true);
        else setDisableCourse(false);
      },
    },
    {
      name: 'gradeSubjectUnitIds',
      defaultValue: editItem?.gradeSubjectUnit
        ? editItem.gradeSubjectUnit?.map((unit) => ({
            id: unit.id,
            name: unit.title,
          }))
        : [],
      type: 'select',
      options: GradeSubjectsUnits.map((unit) => ({
        id: unit.id,
        name: unit.title,
      })),
      isLoading: isLoadingSchoolSubjectsUnits,
      label: t('exams.unit'),
      disabled: !gradeSubjectId,
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

export default SchoolLiveExamForm;
