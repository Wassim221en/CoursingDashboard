/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ICollegeSubjectDetailsUnit,
  TUnit,
} from 'apis/college-subject/college-subject.interfaces';
import { ICourse } from 'apis/course/course.interfaces';
import { IExam, IExamPayloadForm } from 'apis/exam/exam.interfaces';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import { TAutoComplete, TInput } from 'hooks/use-generic-form/types';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useState } from 'react';
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
  isLoadingCollegeSubjects: boolean;
  isLoadingCollegeSubjectsUnits: boolean;
  collegeSubjectsUnits: TUnit[];
  collegeSubjects: ICollegeSubjectDetailsUnit | null;
  collegeDetailsSubjectId: TAutoComplete | null;
  setCourse: React.Dispatch<React.SetStateAction<TAutoComplete | null>>;
  setCollegeSubject: React.Dispatch<React.SetStateAction<TAutoComplete | null>>;
};

function UniversityPastExamForm({
  onSubmit,
  editItem,
  courses,
  isLoadingCourses,
  lessons,
  isLoadingLessons,
  courseId,
  isLoadingCollegeSubjects,
  collegeSubjectsUnits,
  isLoadingCollegeSubjectsUnits,
  collegeDetailsSubjectId,
  setCourse,
  setCollegeSubject,
}: Props) {
  const { t } = useTranslation();

  const [disableCourse, setDisableCourse] = useState(false);
  const [disableSubject, setDisableSubject] = useState(false);
  const subjectId = useSearchParams('subject');

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
      disabled: !!disableCourse,
      hidden: !!subjectId,
      onChange: (val) => {
        setCourse(val);
        if (val) {
          setDisableSubject(true);
          setCollegeSubject(null);
        } else setDisableSubject(false);
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
      disabled: !courseId || !!collegeDetailsSubjectId?.id,
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

  const universityInputs: TInput<IExamPayloadForm>[] = [
    {
      name: 'collegeDetailsSubjectId',
      defaultValue: subjectId
        ? {
            id: subjectId,
            name: '',
          }
        : editItem?.collegeSubject?.id
        ? {
            id: editItem.collegeSubject.id,
            name: editItem.collegeSubject.name,
          }
        : null,
      type: 'select',
      options:
        collegeSubjectsUnits.map((unit) => ({
          id: unit.id,
          name: unit.title,
        })) || [],
      isLoading: isLoadingCollegeSubjects && !disableSubject,
      label: t('exams.subject'),
      md: 6,
      disabled: !!disableSubject,
      hidden: !!subjectId,
      onChange: (val) => {
        setCollegeSubject(val as TAutoComplete);
        if (val) setDisableCourse(true);
        else setDisableCourse(false);
      },
    },
    {
      name: 'collegeSubjectUnitIds',
      defaultValue: editItem?.collegeSubjectUnit?.length
        ? editItem?.collegeSubjectUnit.map((collegeUnit) => ({
            id: collegeUnit.id,
            name: collegeUnit.title,
          }))
        : [],
      type: 'select',
      options:
        collegeSubjectsUnits?.map((unit) => ({
          id: unit?.id,
          name: unit?.title,
        })) || [],

      isLoading: isLoadingCollegeSubjectsUnits,
      label: t('exams.unit'),
      disabled: false,
      md: 6,
      isMulti: true,
    },
  ];

  const { GenericForm } = useGenericForm<IExamPayloadForm>({
    inputs: [...commonInputs, ...universityInputs],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default UniversityPastExamForm;
