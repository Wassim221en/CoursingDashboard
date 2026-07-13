/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';
import collegeQueries from 'apis/college/college.queries';
import { useTranslation } from 'react-i18next';
import { INews, INewsPayloadForm } from 'apis/news/news.interfaces';
import { TInput } from 'hooks/use-generic-form/types';
import gradeQueries from 'apis/grade/grade.queries';
import specializedQueries from 'apis/specialized/specialized.queries';
import { makeNestedItemsFromSpecialized } from 'pages/specialized/specialized.page';
import { useLocation } from 'react-router-dom';
import routesNames from 'routes/constants';
import collegeDetailsQueries from 'apis/college-details/college-details.queries';
import schoolSubjectQueries from 'apis/school-subject/school-subject.queries';
import collegeSubjectQueries from 'apis/college-subject/college-subject.queries';
import { useEffect, useRef, useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

function NewsForm({
  onSubmit,
  editItem,
  progress,
  onAbortClick,
}: {
  onSubmit: TSubmitHandler<INewsPayloadForm>;
  editItem: INews | null;
  progress: number | undefined;
  onAbortClick?: () => void;
}) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const isUniversity = pathname.includes(routesNames.universityNews);
  const isSchool = pathname.includes(routesNames.schoolNews);
  const isSpecialized = pathname.includes(routesNames.specializeNews);

  const [collegeId, setCollegeId] = useState<number | null>(null);

  const [gradeId, setGradeId] = useState<number | undefined>(
    editItem?.grade?.id,
  );
  const [hasGeneralSubject, setHasGeneralSubject] = useState(
    () => !!editItem?.schoolSubject?.id,
  );

  const setValueRef = useRef<UseFormSetValue<INewsPayloadForm> | null>(null);

  useEffect(() => {
    setGradeId(editItem?.grade?.id);
    setHasGeneralSubject(!!editItem?.schoolSubject?.id);
  }, [editItem?.id]);

  const { data: grades, isLoading: isLoadingGrades } =
    gradeQueries.useGradesQuery({}, !isSchool);

  const { data: subjectDetails, isLoading: isLoadingCollegeSubjectsDetails } =
    collegeDetailsQueries.useGetAllCollegeDetailsQuery({ collegeId });

  const { data: colleges, isLoading: isLoadingCollege } =
    collegeQueries.useCollegesQuery({}, !isUniversity);

  const { data: gradeSubjects, isLoading: isLoadingGradeSubjects } =
    gradeQueries.useGradeSubjectsQuery(
      {
        gradeId,
      },
      !isSchool || !gradeId,
    );

  const { data: allSchoolSubjects, isLoading: isLoadingAllSchoolSubjects } =
    schoolSubjectQueries.useSchoolSubjectsQuery(
      { pageNumber: 0, pageSize: 2000 },
      !isSchool,
    );

  const { data: allCollegeSubjects, isLoading: isLoadingAllCollegeSubjects } =
    collegeSubjectQueries.useCollegeSubjectsQuery(
      { pageNumber: 0, pageSize: 2000 },
      !isUniversity,
    );

  const { data: specialized, isLoading: isLoadingSpecialized } =
    specializedQueries.useSpecializedQuery(!isSpecialized);

  const commonInputs: TInput<INewsPayloadForm>[] = [
    {
      name: 'title',
      defaultValue: editItem?.title || '',
      label: t('news.title'),
      type: 'text',
      required: true,
      md: 12,
    },
    {
      name: 'content',
      defaultValue: editItem?.content || '',
      label: t('news.content'),
      type: 'text',
      required: true,
      html: true,
      md: 12,
    },
    {
      name: 'date',
      defaultValue: editItem?.date
        ? new Date(editItem.date).toISOString()
        : null,
      label: t('news.date'),
      type: 'date',
      isDateAndTime: true,
      md: 12,
    },

    {
      name: 'files',
      defaultValue: editItem?.imageUrl
        ? [convertPhotoUrlToFileUploaderFile(editItem.imageUrl)]
        : [],
      label: 'Files',
      type: 'images',
      required: true,
      md: 12,
      cropRatio: 1,
      limitFileSize: false,
      order: 12,
    },
  ];

  const universityInputs: TInput<INewsPayloadForm>[] = [
    ...commonInputs,
    {
      name: 'collegeId',
      defaultValue: editItem?.college
        ? {
            id: editItem.college.id,
            name: editItem.college.name,
          }
        : null,
      label: t('yearlyProjects.college'),
      type: 'select',
      required: false,
      options:
        colleges?.data?.map((grade) => ({
          id: grade.id,
          name: grade.name,
        })) || [],
      md: 12,
      isLoading: isLoadingCollege,
    },
    {
      name: 'collegeDetailsSubjectId',
      defaultValue: editItem?.collegeDetailsSubject
        ? {
            id: editItem?.collegeDetailsSubject?.id,
            name: editItem?.collegeDetailsSubject?.name,
          }
        : null,
      label: t('subjects.subjects'),
      type: 'select',
      md: 12,
      options:
        subjectDetails?.data
          .flatMap((d) => d.subjects)
          .map((d) => ({
            id: d.id,
            name: d.name,
          })) || [],
      isLoading: !!isLoadingCollegeSubjectsDetails && !!collegeId,
      disabled: !collegeId,
    },
    {
      name: 'collegeSubjectId',
      defaultValue: editItem?.collegeSubject
        ? {
            id: editItem.collegeSubject.id,
            name: editItem.collegeSubject.name,
          }
        : null,
      label: t('subjects.subjects'),
      type: 'select',
      md: 12,
      required: false,
      options:
        allCollegeSubjects?.data?.map((s) => ({
          id: s.id,
          name: s.name,
        })) || [],
      isLoading: isLoadingAllCollegeSubjects,
      disabled: !!collegeId,
    },
  ];

  const schoolInputs: TInput<INewsPayloadForm>[] = [
    ...commonInputs,
    {
      name: 'GradeId',
      defaultValue: editItem?.grade
        ? {
            id: editItem.grade.id,
            name: editItem.grade.name,
          }
        : null,
      label: t('schooling.grades'),
      type: 'select',
      md: 12,
      required: false,
      options: grades?.data || [],
      isLoading: isLoadingGrades,
      disabled: hasGeneralSubject,
      onChange(val) {
        setGradeId(val?.id);
        setHasGeneralSubject(false);
        setValueRef.current?.(
          'schoolSubjectId',
          undefined as unknown as INewsPayloadForm['schoolSubjectId'],
        );
      },
    },
    {
      name: 'gradeSubjectId',
      defaultValue:
        editItem?.gradeSubject && editItem.gradeSubject.subject
          ? {
              id: editItem.gradeSubject.id,
              name: editItem.gradeSubject.subject.name,
            }
          : null,
      label: t('news.subjectForGrade'),
      md: 12,
      type: 'select',
      required: false,
      options:
        gradeSubjects?.data?.map((subject) => ({
          id: subject?.id,
          name: subject?.subject.name,
        })) || [],
      isLoading: isLoadingGradeSubjects,
      disabled: !gradeId || hasGeneralSubject,
    },
    {
      name: 'schoolSubjectId',
      defaultValue: editItem?.schoolSubject
        ? {
            id: editItem.schoolSubject.id,
            name: editItem.schoolSubject.name,
          }
        : null,
      label: t('news.generalSubjects'),
      md: 12,
      type: 'select',
      required: false,
      options: allSchoolSubjects?.data || [],
      isLoading: isLoadingAllSchoolSubjects,
      disabled: !!gradeId,
      onChange(val) {
        const picked = !!val?.id;
        setHasGeneralSubject(picked);
        if (picked) {
          setGradeId(undefined);
          setValueRef.current?.(
            'GradeId',
            undefined as unknown as INewsPayloadForm['GradeId'],
          );
          setValueRef.current?.(
            'gradeSubjectId',
            undefined as unknown as INewsPayloadForm['gradeSubjectId'],
          );
        }
      },
    },
  ];

  const specializeInputs: TInput<INewsPayloadForm>[] = [
    ...commonInputs,
    {
      name: 'specializedId',
      defaultValue: editItem?.specialized?.id || 0,
      type: 'nested-select',
      options:
        specialized?.data?.map((special) =>
          makeNestedItemsFromSpecialized(special),
        ) || [],
      md: 12,
      isLoading: isLoadingSpecialized,
      order: 3,
    },
  ];

  const { GenericForm, watch, setValue } = useGenericForm<INewsPayloadForm>({
    inputs: isSpecialized
      ? specializeInputs
      : isSchool
      ? schoolInputs
      : universityInputs,
    onSubmit: (data) => onSubmit(data),
    progressPercent: progress,
    onAbortClick,
  });

  useEffect(() => {
    setValueRef.current = setValue;
  }, [setValue]);

  useEffect(() => {
    if (watch('collegeId')?.id) {
      setCollegeId(watch('collegeId').id);
    }
  }, [watch('collegeId')?.id]);

  return GenericForm;
}

export default NewsForm;
