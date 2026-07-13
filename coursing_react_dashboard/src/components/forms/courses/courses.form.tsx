/* eslint-disable no-nested-ternary */
import collegeDetailsQueries from 'apis/college-details/college-details.queries';
import collegeQueries from 'apis/college/college.queries';
import {
  ICourseDetails,
  ICoursePayloadForm,
} from 'apis/course/course.interfaces';
import gradeQueries from 'apis/grade/grade.queries';
import instructorQueries from 'apis/instructor/instructor.queries';
import specializedQueries from 'apis/specialized/specialized.queries';
import { TInput } from 'hooks/use-generic-form/types';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { makeNestedItemsFromSpecialized } from 'pages/specialized/specialized.page';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import routesNames from 'routes/constants';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

type Props = {
  onSubmit: TSubmitHandler<ICoursePayloadForm>;
  editItem: ICourseDetails | null;
  progress: number | undefined;
  onAbortClick?: () => void;
};

function CourseForm({ onSubmit, editItem, progress, onAbortClick }: Props) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const subjectId = useSearchParams('subject');

  const [gradeId, setGradeId] = useState<number | null>(null);

  const [collegeId, setCollegeId] = useState<number | null>(null);

  const isSchool =
    pathname.includes(routesNames.schoolCourses) ||
    pathname.includes(routesNames.schoolSubjectsDetails);
  const isSpecialized = pathname.includes(routesNames.specializedCourses);

  const { data: instructors, isLoading } =
    instructorQueries.useInstructorQuery();

  const { data: colleges, isLoading: isLoadingCollege } =
    collegeQueries.useCollegesQuery();

  const { data: subjectDetails, isLoading: isLoadingCollegeSubjects } =
    collegeDetailsQueries.useGetAllCollegeDetailsQuery({ collegeId });

  const { data: grades, isLoading: isLoadingGrades } =
    gradeQueries.useGradesQuery();

  const { data: gradeSubjects, isLoading: isLoadingGradeSubjects } =
    gradeQueries.useGradeSubjectsQuery(
      {
        gradeId: gradeId || undefined,
      },
      !gradeId,
    );

  const { data: specialized, isLoading: isLoadingSpecialized } =
    specializedQueries.useSpecializedQuery();

  const commonInputs: TInput<ICoursePayloadForm>[] = [
    {
      name: 'title',
      defaultValue: editItem?.title || '',
      label: t('courses.courseTitle'),
      type: 'text',
      required: true,
      md: isSpecialized ? 6 : subjectId ? 4 : 4,
      order: 0,
    },
    {
      name: 'instructorsIds',
      defaultValue:
        editItem?.instructors.map((i) => ({
          id: i?.id,
          name: i.fullName,
        })) || [],
      options:
        instructors?.data?.map((i) => ({
          id: i?.id,
          name: i.fullName,
        })) || [],
      label: t('common.instructors'),
      isMulti: true,
      type: 'select',
      required: true,
      isLoading,
      md: isSpecialized ? 6 : 4,
      order: isSpecialized ? 1 : 2,
    },
    {
      name: 'hours',
      defaultValue: editItem?.hours || 0,
      label: t('courses.hours'),
      type: 'number',
      required: true,
      md: 4,
      order: 2,
    },
    {
      name: 'minute',
      defaultValue: editItem?.minute || 0,
      label: t('courses.minutes'),
      type: 'number',
      required: true,
      md: 4,
      order: 2,
    },
    {
      name: 'points',
      defaultValue: editItem?.points || 0,
      label: t('courses.points'),
      type: 'number',
      required: true,
      md: 4,
      order: 2,
    },
    {
      name: 'expirationInDays',
      defaultValue: editItem?.expirationInDays || 0,
      label: t('courses.expireDate'),
      type: 'number',
      required: true,
      md: 4,
      order: 2,
    },
    {
      name: 'aboutCourse',
      defaultValue: editItem?.aboutCourse || '',
      label: t('courses.aboutCourse'),
      type: 'text',
      required: true,
      html: true,
      md: 12,
      order: 3,
    },
    {
      name: 'files',
      defaultValue: editItem?.coverUrl
        ? [convertPhotoUrlToFileUploaderFile(editItem?.coverUrl)]
        : [],
      label: t('courses.courseCoverImages'),
      type: 'images',
      limitFileSize: false,
      required: true,
      md: 12,
      order: 100,
      cropRatio: 16 / 9,
    },
  ];

  const specializedInputs: TInput<ICoursePayloadForm>[] = [
    ...commonInputs,
    {
      name: 'specializedId',
      defaultValue: editItem?.speciality?.id || 0,
      type: 'nested-select',
      required: true,
      options:
        specialized?.data?.map((special) =>
          makeNestedItemsFromSpecialized(special),
        ) || [],
      md: 6,
      isLoading: isLoadingSpecialized,
      order: 3,
    },
  ];

  const universityInputs: TInput<ICoursePayloadForm>[] = [
    ...commonInputs,
    {
      name: 'collegeId',
      defaultValue: null,
      label: t('yearlyProjects.college'),
      type: 'select',
      options:
        colleges?.data?.map((grade) => ({
          id: grade.id,
          name: grade.name,
        })) || [],
      md: 4,
      isLoading: isLoadingCollege,
      onChange: (val) => setCollegeId(val?.id || null),
      hidden: !!subjectId,
    },
    {
      name: 'collegeDetailsSubjectId',
      defaultValue: editItem?.collegeDetailsSubject?.id
        ? {
            id: editItem?.collegeDetailsSubject?.id,
            name: editItem?.collegeDetailsSubject?.name,
          }
        : subjectId
        ? {
            name: subjectId.toString(),
            id: subjectId,
          }
        : null,
      label: t('subjects.subjects'),
      type: 'select',
      required: true,
      md: 4,
      options:
        subjectDetails?.data
          .flatMap((d) => d.subjects)
          .map((d) => ({
            id: d.id,
            name: d.name,
          })) || [],
      isLoading: isLoadingCollegeSubjects && !!collegeId,
      order: 1,
      hidden: !!subjectId,
      disabled: false,
    },
  ];

  const schoolInputs: TInput<ICoursePayloadForm>[] = [
    ...commonInputs,

    {
      name: 'gradeId',
      defaultValue: editItem?.grade?.id
        ? {
            id: editItem?.grade?.id,
            name: editItem?.grade.name,
          }
        : null,
      label: t('grades.grade'),
      md: 4,
      type: 'select',
      required: !subjectId,
      options:
        grades?.data?.map((grade) => ({
          id: grade?.id,
          name: grade?.name,
        })) || [],
      isLoading: isLoadingGrades,
      hidden: !!subjectId,
      onChange: (val) => setGradeId(val?.id || null),
    },
    {
      name: 'gradeSubjectId',
      defaultValue: editItem?.gradeSubject?.id
        ? {
            id: editItem?.gradeSubject?.id,
            name: editItem?.gradeSubject?.name,
          }
        : subjectId
        ? {
            name: subjectId.toString(),
            id: subjectId,
          }
        : null,
      label: t('subjects.subjects'),
      md: 4,
      type: 'select',
      required: true,
      options:
        gradeSubjects?.data?.map((subject) => ({
          id: subject?.id,
          name: subject?.subject.name,
        })) || [],
      isLoading: isLoadingGradeSubjects && !!gradeId,
      disabled: !gradeId,
      hidden: !!subjectId,
    },
  ];

  const { GenericForm } = useGenericForm<ICoursePayloadForm>({
    inputs: isSpecialized
      ? specializedInputs
      : isSchool
      ? schoolInputs
      : universityInputs,
    onSubmit: (data) => onSubmit(data),
    submitButtonWidth: '220px',
    progressPercent: progress,
    onAbortClick,
  });

  return GenericForm;
}

export default CourseForm;
