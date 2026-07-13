/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import collegeDetailsQueries from 'apis/college-details/college-details.queries';
import {
  ICollegeSubjectDetailsUnit,
  TUnit,
} from 'apis/college-subject/college-subject.interfaces';
import collegeSubjectQueries from 'apis/college-subject/college-subject.queries';
import collegeQueries from 'apis/college/college.queries';
import { ICourse } from 'apis/course/course.interfaces';
import { IExam, IExamPayloadForm } from 'apis/exam/exam.interfaces';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import { examType } from 'constants/constants';
import { getNameById } from 'hooks/use-generic-form/helpers';
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
  collegeSubjectsUnits: TUnit[];
  collegeSubjects: ICollegeSubjectDetailsUnit | null;
  isLoadingCollegeSubjectsUnits: boolean;
  collegeDetailsSubjectId: TAutoComplete | null;
  setCourse: React.Dispatch<React.SetStateAction<TAutoComplete | null>>;
  setCollegeSubject: React.Dispatch<React.SetStateAction<TAutoComplete | null>>;
};

function UniversityExamForm({
  onSubmit,
  editItem,
  courses,
  isLoadingCourses,
  lessons,
  isLoadingLessons,
  courseId,
  collegeDetailsSubjectId,
  setCourse,
  setCollegeSubject,
}: Props) {
  const { t } = useTranslation();

  const [disableCourse, setDisableCourse] = useState(false);
  const [disableSubject, setDisableSubject] = useState(false);
  const [collegeId, setCollegeId] = useState<number | null>(null);
  const [subjectDetailsId, setSubjectDetailsId] = useState<number | null>(null);

  const subjectId = useSearchParams('subject');

  const { data: colleges, isLoading: isLoadingCollege } =
    collegeQueries.useCollegesQuery();

  const { data: subjectDetails, isLoading: isLoadingCollegeSubjectsDetails } =
    collegeDetailsQueries.useGetAllCollegeDetailsQuery({ collegeId });

  const { data: subjectDetailsUnits, isLoading: isLoadingSubjectDetailsUnits } =
    collegeSubjectQueries.useCollegeSubjectDetailsUnitQuery(
      subjectId ? subjectId : subjectDetailsId!,
      !!subjectDetailsId || !!subjectId,
    );

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
      name: 'examType',
      defaultValue: editItem?.examType
        ? {
            id: editItem?.examType,
            name: t(
              getNameById(examType, String(editItem?.examType)).toString(),
            ),
          }
        : null,
      type: 'select',
      label: t('exams.examType'),
      options: examType
        .filter((f) => f.id === 1 || f.id === 2 || f.id === 3)
        .map((type) => ({
          id: type.id,
          name: t(type.name),
        })),
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
      name: 'collegeId',
      defaultValue: null,
      label: t('yearlyProjects.college'),
      type: 'select',
      required: false,
      options:
        colleges?.data?.map((grade) => ({
          id: grade.id,
          name: grade.name,
        })) || [],
      md: 6,
      isLoading: isLoadingCollege,
      hidden: !!subjectId,
      onChange: (val) => setCollegeId(val?.id || 0),
      disabled: !!courseId?.id,
    },
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
        subjectDetails?.data
          .flatMap((d) => d.subjects)
          .map((d) => ({
            id: d.id,
            name: d.name,
          })) || [],
      isLoading: isLoadingCollegeSubjectsDetails && !!collegeId,
      label: t('exams.subject'),
      md: 6,
      disabled: !!disableSubject,
      hidden: !!subjectId,
      onChange: (val) => {
        setCollegeSubject(val);
        setSubjectDetailsId(val?.id || 0);
        if (val) {
          setDisableCourse(true);
          setCourse(null);
        } else setDisableCourse(false);
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
        subjectDetailsUnits?.units?.map((unit) => ({
          id: unit?.id,
          name: unit?.title,
        })) || [],

      isLoading: isLoadingSubjectDetailsUnits && !!subjectDetailsId,
      label: t('exams.unit'),
      disabled: !subjectId && !subjectDetailsId,
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

export default UniversityExamForm;
