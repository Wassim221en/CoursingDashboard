/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { IQuestionBankPayloadForm } from 'apis/qusetions/questions.interfaces';
import { TInput } from 'hooks/use-generic-form/types';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import routesNames from 'routes/constants';
import specializedQueries from 'apis/specialized/specialized.queries';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useTranslation } from 'react-i18next';
import gradeQueries from 'apis/grade/grade.queries';
import collegeQueries from 'apis/college/college.queries';
import collegeDetailsQueries from 'apis/college-details/college-details.queries';

type Props = {
  onSubmit: TSubmitHandler<IQuestionBankPayloadForm>;
};

function QuestionBankUploadExcelForm({ onSubmit }: Props) {
  const { pathname = '' } = useLocation();
  const { t } = useTranslation();

  const subjectId = useSearchParams('subject');

  const isSchool = pathname.includes(routesNames.schoolQuestionsBank);
  const isSpecialized =
    pathname.includes(routesNames.specializeQuestionsBank) ||
    pathname.includes(routesNames.specializeExamQuestions);

  const isSchoolSubjectDetails =
    pathname.includes(routesNames.schoolSubjectsDetails) ||
    pathname.includes(routesNames.schoolQuestionsBank) ||
    pathname.includes(routesNames.schoolExamQuestions);

  const isUniversitySubjectDetails =
    pathname.includes(routesNames.collegeSubjectsDetails) ||
    pathname.includes(routesNames.universityQuestionsBank) ||
    pathname.includes(routesNames.universityExamQuestions);

  const [collegeId, setCollegeId] = useState<number | null>(null);

  const { data: colleges, isLoading: isLoadingCollege } =
    collegeQueries.useCollegesQuery();

  const {
    data: collegeSubjectDetails,
    isLoading: isLoadingCollegeSubjectsDetails,
  } = collegeDetailsQueries.useGetAllCollegeDetailsQuery({ collegeId });

  const { data: Specializes, isLoading: isLoadingSpecializes } =
    specializedQueries.useSpecializedQuery();

  const { data: gradeSubjects, isLoading: isLoadingShoolSubjects } =
    gradeQueries.useGradeSubjectsQuery({ gradeId: 0 }, !isSchool);

  const commonInputs: TInput<IQuestionBankPayloadForm>[] = [
    {
      name: 'files',
      defaultValue: [],
      label: 'Excel File',
      type: 'all',
      required: true,
      md: 12,
      cropRatio: 1,
      limitFileSize: false,
    },
  ];

  const UniversityInputs: TInput<IQuestionBankPayloadForm>[] = [
    {
      name: 'collegeId',
      defaultValue: null,
      label: t('yearlyProjects.college'),
      type: 'select',
      required: !subjectId,
      options:
        colleges?.data?.map((grade) => ({
          id: grade.id,
          name: grade.name,
        })) || [],
      md: 6,
      isLoading: isLoadingCollege,
      hidden: !!subjectId,
      onChange: (val) => setCollegeId(val?.id || 0),
    },
    {
      name: 'collegeDetailsSubjectId',
      defaultValue: subjectId
        ? {
            id: subjectId,
            name: '',
          }
        : null,
      type: 'select',
      options:
        collegeSubjectDetails?.data
          .flatMap((d) => d.subjects)
          .map((d) => ({
            id: d.id,
            name: d.name,
          })) || [],
      isLoading: !!isLoadingCollegeSubjectsDetails && !!collegeId,
      label: t('exams.subject'),
      md: 6,
      hidden: !!subjectId,
    },

    ...commonInputs,
  ];

  const SchoolInputs: TInput<IQuestionBankPayloadForm>[] = [
    {
      name: 'gradeSubjectId',
      defaultValue: subjectId
        ? {
            name: subjectId.toString(),
            id: subjectId,
          }
        : null,
      type: 'select',
      options:
        gradeSubjects?.data.map((subject) => ({
          id: subject.id,
          name: subject.subject.name,
        })) || [],
      isLoading: isLoadingShoolSubjects,
      label: t('exams.subject'),
      md: 6,
      disabled: !!subjectId,
      hidden: !!subjectId,
    },

    ...commonInputs,
  ];
  const SpecializeInputs: TInput<IQuestionBankPayloadForm>[] = [
    {
      name: 'specialityId',
      defaultValue: subjectId
        ? {
            id: subjectId,
            name: '',
          }
        : null,
      type: 'select',
      options: Specializes?.data || [],
      isLoading: isLoadingSpecializes,
      label: t('exams.subject'),
      disabled: !Specializes,
      hidden: !!subjectId,
      md: 6,
    },
    ...commonInputs,
  ];

  const { GenericForm } = useGenericForm<IQuestionBankPayloadForm>({
    inputs: isSpecialized
      ? SpecializeInputs
      : isSchool || isSchoolSubjectDetails
      ? SchoolInputs
      : isUniversitySubjectDetails
      ? UniversityInputs
      : [],
    onSubmit: (data) => onSubmit(data),

    submitButtonWidth: '220px',
  });

  return GenericForm;
}

export default QuestionBankUploadExcelForm;
