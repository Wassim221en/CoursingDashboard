/* eslint-disable no-unneeded-ternary */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  IQuestionBank,
  IQuestionBankPayloadForm,
  QuestionTypeEnum,
} from 'apis/qusetions/questions.interfaces';
import { QuestionLevel, QuestionType } from 'constants/constants';
import { getNameById } from 'hooks/use-generic-form/helpers';
import { TInput } from 'hooks/use-generic-form/types';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useEffect, useState } from 'react';
import collegeSubjectQueries from 'apis/college-subject/college-subject.queries';
import schoolUnitQueries from 'apis/school-unit/school-unit.queries';
import { useLocation } from 'react-router-dom';
import routesNames from 'routes/constants';
import specializedQueries from 'apis/specialized/specialized.queries';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useTranslation } from 'react-i18next';
import gradeQueries from 'apis/grade/grade.queries';
import collegeQueries from 'apis/college/college.queries';
import collegeDetailsQueries from 'apis/college-details/college-details.queries';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

type Props = {
  onSubmit: TSubmitHandler<IQuestionBankPayloadForm>;
  editItem?: IQuestionBank | null;
  progress: number | undefined;
  isMultiUnits?: boolean;
  onAbortClick?: () => void;
};

function QuestionBankForm({
  onSubmit,
  editItem,
  isMultiUnits = true,
  progress,
  onAbortClick,
}: Props) {
  const { pathname = '' } = useLocation();
  const { t } = useTranslation();

  const subjectId = useSearchParams('subject');

  const isSchool = pathname.includes(routesNames.schoolQuestionsBank);
  const isSpecialized =
    pathname.includes(routesNames.specializeQuestionsBank) ||
    pathname.includes(routesNames.specializeExamQuestions);

  const isSchoolSubjectDetails = pathname.includes(
    routesNames.schoolSubjectsDetails,
  );

  const isCollegeSubjectDetails = pathname.includes(
    routesNames.collegeSubjectsDetails,
  );

  const isSchoolExamQuestion = pathname.includes(
    routesNames.schoolExamQuestions,
  );

  const [collegeDetailsSubjectId, setCollegeDetailsSubjectId] = useState<
    number | null
  >(0);

  const [gradeSubjectId, setGradeSubjectId] = useState(0);

  const [gradeId, setGradeId] = useState(0);

  const [collegeId, setCollegeId] = useState<number | null>(null);

  const [answerType, setAnswerType] = useState<number>(2);

  useEffect(() => {
    if (subjectId && isCollegeSubjectDetails) {
      setCollegeDetailsSubjectId(subjectId);
    }
    if (subjectId && (isSchoolSubjectDetails || isSchoolExamQuestion))
      setGradeSubjectId(subjectId);
  }, [subjectId]);

  const { data: colleges, isLoading: isLoadingCollege } =
    collegeQueries.useCollegesQuery();

  const {
    data: collegeSubjectDetails,
    isLoading: isLoadingCollegeSubjectsDetails,
  } = collegeDetailsQueries.useGetAllCollegeDetailsQuery({ collegeId });

  const { data: subjectUnitsDetails, isLoading: isLoadingSubjectDetailsUnits } =
    collegeSubjectQueries.useCollegeSubjectDetailsUnitQuery(
      subjectId ? subjectId : collegeDetailsSubjectId!,
      !!collegeDetailsSubjectId,
      // collegeDetailsSubjectId
      //   ? !!collegeDetailsSubjectId
      // : !!editItem?.collegeDetailsSubject?.id,
    );

  const { data: Specializes, isLoading: isLoadingSpecializes } =
    specializedQueries.useSpecializedQuery();

  const { data: grades, isLoading: isLoadingGrades } =
    gradeQueries.useGradesQuery();

  const { data: gradeSubjects, isLoading: isLoadingGradeSubjects } =
    gradeQueries.useGradeSubjectsQuery(
      { gradeId: gradeId || editItem?.gradeSubject?.grade.id },

      gradeId ? !gradeId : !editItem?.gradeSubject?.grade.id,
    );

  const { data: GradeSubjectUnits, isLoading: isLoadingGradeSubjectUnits } =
    schoolUnitQueries.useGradeSubjectUnitsQuery(
      {
        gradeSubjectId: gradeSubjectId
          ? gradeSubjectId
          : editItem?.gradeSubject?.id || 0,
      },
      gradeSubjectId ? !!gradeSubjectId : !!editItem?.gradeSubject?.id,
    );

  useEffect(() => {
    if (editItem?.questionType === 1) {
      setAnswerType(1);
    } else if (editItem?.questionType === 3) {
      setAnswerType(3);
    } else if (editItem?.questionType === 2) {
      setAnswerType(2);
    }
  }, [editItem?.questionType]);

  // const TextInputs: TInput<IQuestionBankPayloadForm>[] = [
  //   {
  //     name: 'body',
  //     defaultValue: editItem?.body ?? '',
  //     type: 'text',
  //     label: t('questionsBank.questionTitle'),
  //     required: true,
  //     md: 12,
  //   },
  //   {
  //     name: 'title',
  //     defaultValue: editItem?.title ?? '',
  //     type: 'text',
  //     html: true,
  //     label: t('questionsBank.question'),
  //     required: true,
  //     md: 12,
  //   },
  // ];

  // const MultiChoiceInputs: TInput<IQuestionBankPayloadForm>[] = [
  //   {
  //     name: 'body',
  //     defaultValue: editItem?.body ?? '',
  //     type: 'text',
  //     label: t('questionsBank.questionTitle'),
  //     required: true,
  //     md: 12,
  //   },
  //   {
  //     name: 'title',
  //     defaultValue: editItem?.title ?? '',
  //     type: 'text',
  //     html: true,
  //     label: t('questionsBank.question'),
  //     required: true,
  //     md: 12,
  //   },
  //   {
  //     type: 'field-array',
  //     defaultValue: [],
  //     label: String(t('questionsBank.options')),
  //     name: 'choices',
  //     md: 12,
  //     fields: [
  //       {
  //         name: 'theTrueAnswer',
  //         defaultValue: false,
  //         label: '',
  //         type: 'boolean',
  //       },
  //       {
  //         name: 'title',
  //         defaultValue: '',
  //         label: t('questionsBank.option'),
  //         type: 'text',
  //       },
  //     ],
  //   },
  // ];

  // const TrueAndFalseQuestionInputs: TInput<IQuestionBankPayloadForm>[] = [
  //   {
  //     name: 'body',
  //     defaultValue: editItem?.body ?? '',
  //     type: 'text',
  //     label: t('questionsBank.questionTitle'),
  //     required: true,
  //     md: 12,
  //   },
  //   {
  //     name: 'title',
  //     defaultValue: editItem?.title ?? '',
  //     type: 'text',
  //     html: true,
  //     label: t('questionsBank.question'),
  //     required: true,
  //     md: 12,
  //   },
  //   {
  //     name: 'trueFalseAnswer',
  //     defaultValue: 0,
  //     label: String(t('questionsBank.answers')),
  //     options: [
  //       {
  //         label: t('questionsBank.true'),
  //         value: 1,
  //       },
  //       {
  //         label: t('questionsBank.false'),
  //         value: 0,
  //       },
  //     ],
  //     type: 'radio',
  //     md: 12,
  //     xs: 12,
  //   },
  // ];

  const commonInputs: TInput<IQuestionBankPayloadForm>[] = [
    {
      name: 'questionType',
      defaultValue: editItem?.questionType
        ? {
            id: editItem?.questionType,
            name: t(getNameById(QuestionType, String(editItem?.questionType))),
          }
        : null,
      type: 'select',
      label: t('questionsBank.questionType'),
      options: QuestionType.map((type) => ({
        id: type.id,
        name: t(type.name),
      })),
      required: true,
      md: 6,
      onChange: (val) => {
        if (val?.id) {
          setAnswerType(val?.id);
        }
      },
    },

    {
      name: 'questionLevel',
      defaultValue: editItem?.questionType
        ? {
            id: editItem?.questionType,
            name: t(
              getNameById(QuestionLevel, String(editItem?.questionLevel)),
            ),
          }
        : null,
      type: 'select',
      label: t('questionsBank.questionLevel'),
      options:
        QuestionLevel.map((level) => ({
          id: level.id,
          name: t(level.name),
        })) || null,
      // required: true,
      md: 12,
      order: 11,
    },
    {
      name: 'note',
      defaultValue: editItem?.note ?? '',
      type: 'text',
      label: t('questionsBank.note'),
      // required: true,
      md: 12,
      order: 12,
    },
    {
      type: 'field-array',
      name: 'tags',
      defaultValue: [],
      label: String(t('questionsBank.tags')),
      order: 13,
      md: 12,
      fields: [
        {
          name: 'name',
          defaultValue: '',
          label: t('questionsBank.tags'),
          type: 'text',
        },
      ],
    },
    {
      name: 'files',
      defaultValue: editItem?.imageUrl
        ? [convertPhotoUrlToFileUploaderFile(editItem?.imageUrl)]
        : [],
      label: `${t('questionsBank.questionHelpImage')} Ratio: 16 / 9`,
      type: 'images',
      limitFileSize: false,

      cropRatio: 16 / 9,
      // required: true,
      md: 14,
      order: 100,
    },
    // ...(answerType === 1
    //   ? MultiChoiceInputs
    //   : answerType === 2
    //   ? TextInputs
    //   : answerType === 3
    //   ? TrueAndFalseQuestionInputs
    //   : TextInputs),

    // text

    {
      name: 'body',
      defaultValue: editItem?.body ?? '',
      type: 'text',
      label: t('questionsBank.questionTitle'),
      required: answerType === QuestionTypeEnum.Text ? true : false,
      hidden: answerType === QuestionTypeEnum.Text ? false : true,
      md: 12,
    },
    {
      name: 'title',
      defaultValue: editItem?.title ?? '',
      type: 'text',
      html: true,
      hidden: answerType === QuestionTypeEnum.Text ? false : true,
      required: answerType === QuestionTypeEnum.Text ? true : false,
      label: t('questionsBank.question'),
      md: 12,
    },

    // multi choice

    {
      name: 'body',
      defaultValue: editItem?.body ?? '',
      type: 'text',
      hidden: answerType === QuestionTypeEnum.MultiChoice ? false : true,
      label: t('questionsBank.questionTitle'),
      required: answerType === QuestionTypeEnum.MultiChoice ? true : false,
      md: 12,
    },
    {
      name: 'title',
      defaultValue: editItem?.title ?? '',
      type: 'text',
      html: true,
      hidden: answerType === QuestionTypeEnum.MultiChoice ? false : true,
      label: t('questionsBank.question'),
      required: answerType === QuestionTypeEnum.MultiChoice ? true : false,
      md: 12,
    },
    {
      type: 'field-array',
      defaultValue: [],
      hidden: answerType === QuestionTypeEnum.MultiChoice ? false : true,
      label: String(t('questionsBank.options')),
      required: answerType === QuestionTypeEnum.MultiChoice ? true : false,
      name: 'choices',
      md: 12,
      fields: [
        {
          name: 'theTrueAnswer',
          defaultValue: false,
          label: '',
          type: 'boolean',
        },
        {
          name: 'title',
          defaultValue: '',
          label: t('questionsBank.option'),
          type: 'text',
        },
      ],
    },

    // true and false

    {
      name: 'body',
      defaultValue: editItem?.body ?? '',
      type: 'text',
      hidden: answerType === QuestionTypeEnum.TrueAndFalse ? false : true,
      label: t('questionsBank.questionTitle'),
      required: answerType === QuestionTypeEnum.TrueAndFalse ? true : false,
      md: 12,
    },
    {
      name: 'title',
      defaultValue: editItem?.title ?? '',
      type: 'text',
      html: true,
      hidden: answerType === QuestionTypeEnum.TrueAndFalse ? false : true,
      label: t('questionsBank.question'),
      required: answerType === QuestionTypeEnum.TrueAndFalse ? true : false,
      md: 12,
    },
    {
      name: 'trueFalseAnswer',
      defaultValue: 0,
      label: String(t('questionsBank.answers')),
      hidden: answerType === QuestionTypeEnum.TrueAndFalse ? false : true,
      required: answerType === QuestionTypeEnum.TrueAndFalse ? true : false,
      options: [
        {
          label: t('questionsBank.true'),
          value: 1,
        },
        {
          label: t('questionsBank.false'),
          value: 0,
        },
      ],
      type: 'radio',
      md: 12,
      xs: 12,
    },
  ];

  const UniversityInputs: TInput<IQuestionBankPayloadForm>[] = [
    {
      name: 'collegeId',
      defaultValue: editItem?.collegeDetailsSubject?.college
        ? {
            id: editItem?.collegeDetailsSubject?.college?.id,
            name: editItem?.collegeDetailsSubject?.college?.name,
          }
        : null,
      label: t('yearlyProjects.college'),
      type: 'select',
      options:
        colleges?.data?.map((grade) => ({
          id: grade.id,
          name: grade.name,
        })) || [],
      md: 6,
      isLoading: isLoadingCollege,
      hidden: !!subjectId,
      onChange: (val) => setCollegeId(val?.id || null),
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
      onChange: (val) => setCollegeDetailsSubjectId(val?.id || null),
    },
    {
      name: 'collegeSubjectUnitIds',
      defaultValue: editItem?.collegeDetailsSubjectUnitId
        ? editItem.collegeDetailsSubjectUnitId.map((collegeSubjectUnit) => ({
            id: collegeSubjectUnit.id,
            name: collegeSubjectUnit.title,
          }))
        : [],

      type: 'select',
      options:
        subjectUnitsDetails?.units?.map((unit) => ({
          id: unit.id,
          name: unit.title,
        })) || [],
      label: t('exams.unit'),
      isLoading: !!isLoadingSubjectDetailsUnits && !!collegeDetailsSubjectId,
      disabled: !collegeDetailsSubjectId && !subjectId,
      // TODO: maybe can use for edit collegeDetailsSubjectId
      // disabled: collegeDetailsSubjectId && subjectId? !collegeDetailsSubjectId && !subjectId:!editItem?.collegeDetailsSubject?.id,
      md: subjectId ? 6 : 6,
      isMulti: isMultiUnits,
    },
    ...commonInputs,
  ];

  const SchoolInputs: TInput<IQuestionBankPayloadForm>[] = [
    {
      name: 'gradeId',
      defaultValue: editItem?.gradeSubject?.grade
        ? {
            id: editItem?.gradeSubject?.grade.id,
            name: editItem?.gradeSubject?.grade.name,
          }
        : null,
      label: t('grades.grade'),
      md: 6,
      type: 'select',
      options:
        grades?.data?.map((grade) => ({
          id: grade?.id,
          name: grade?.name,
        })) || [],
      isLoading: isLoadingGrades,
      hidden: !!subjectId,
      onChange: (val) => setGradeId(val?.id || 0),
    },
    {
      name: 'gradeSubjectId',
      defaultValue: subjectId
        ? {
            name: subjectId.toString(),
            id: subjectId,
          }
        : editItem?.gradeSubject?.id
        ? {
            name: editItem?.gradeSubject.name,
            id: editItem.gradeSubject.id,
          }
        : null,
      type: 'select',
      options:
        gradeSubjects?.data.map((gradeSubject) => ({
          id: gradeSubject.id,
          name: gradeSubject.subject.name,
        })) || [],
      label: t('exams.subject'),
      md: 6,
      isLoading: !!isLoadingGradeSubjects && !!gradeId,
      disabled: gradeId ? !gradeId : !editItem?.gradeSubject?.grade.id,
      hidden: !!subjectId,
      onChange: (val) => setGradeSubjectId(val?.id || 0),
    },
    {
      name: 'gradeSubjectUnitIds',
      defaultValue:
        editItem?.gradeSubjectUnitId?.map((su) => ({
          id: su.id,
          name: su.title,
        })) || [],
      type: 'select',
      options:
        GradeSubjectUnits?.data.map((unit) => ({
          id: unit.id,
          name: unit.title,
        })) || [],
      label: t('exams.unit'),
      isLoading: !!isLoadingGradeSubjectUnits && !!gradeSubjectId,
      disabled: gradeSubjectId ? !gradeSubjectId : !editItem?.gradeSubject?.id,
      isMulti: isMultiUnits,
      md: 6,
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
        : editItem?.specialized
        ? {
            name: editItem?.specialized.name,
            id: editItem.specialized.id,
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

  const { GenericForm, setValue } = useGenericForm<IQuestionBankPayloadForm>({
    inputs: isSpecialized
      ? SpecializeInputs
      : isSchool || isSchoolSubjectDetails || isSchoolExamQuestion
      ? SchoolInputs
      : UniversityInputs,
    onSubmit: (data) => onSubmit(data),
    progressPercent: progress,
    onAbortClick,
    submitButtonWidth: '220px',
  });

  useEffect(() => {
    setValue('trueFalseAnswer', editItem?.trueFalseAnswer ? 1 : 0);
    if (editItem?.choices) setValue('choices', editItem.choices);
    if (editItem?.questionTags) setValue('tags', editItem.questionTags);
  }, [editItem?.choices, editItem?.trueFalseAnswer, editItem?.questionTags]);

  return GenericForm;
}

export default QuestionBankForm;
