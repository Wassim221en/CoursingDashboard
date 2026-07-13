import collegeDetailsQueries from 'apis/college-details/college-details.queries';
import collegeQueries from 'apis/college/college.queries';
import gradeQueries from 'apis/grade/grade.queries';
import instructorApi from 'apis/instructor/instructor.api';
import {
  IActionInstructorPayload,
  IInstructor,
} from 'apis/instructor/instructor.interfaces';
import universityQueries from 'apis/university/university.queries';
import { typeInstructor } from 'constants/constants';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onSubmit: TSubmitHandler<IActionInstructorPayload>;
  editItem: IInstructor | null;
};

function InstructorForm({ onSubmit, editItem }: Props) {
  const [typeInstructorSelected, setTypeInstructorSelected] =
    useState<number>();
  const [universityId, setUniversityId] = useState<number | undefined>();
  const [collegeId, setCollegeId] = useState<number | undefined | null>();
  const [gradeId, setGradeId] = useState<number | undefined>();
  const [isLoading, setLoading] = useState(!!editItem);

  const { t } = useTranslation();
  const { data: allUniversity } = universityQueries.useUniversitiesQuery();
  const { data: allColleges } = collegeQueries.useCollegesQuery({
    universityId,
  });
  const { data: allSubjects } =
    collegeDetailsQueries.useGetAllCollegeDetailsQuery({ collegeId });

  const { data: gradeLevel } = gradeQueries.useGradesQuery();
  const { data: educationalLevels } = gradeQueries.useGradeSubjectsQuery(
    { gradeId },
    !gradeId,
  );

  const { GenericForm, reset } = useGenericForm<IActionInstructorPayload>({
    inputs: [
      {
        name: 'Type',
        defaultValue: null,
        label: t('instructors.type-instructor'),
        type: 'select',
        required: true,
        md: 12,
        options: typeInstructor ?? [],
        disabled: isLoading,
        onChange: (type) => {
          setTypeInstructorSelected(type?.id ?? undefined);
          setUniversityId(undefined);
          setCollegeId(undefined);
          setGradeId(undefined);
          reset({
            Type: type ?? undefined,
            university: null,
            colleges: null,
            CollegeDetailsSubjectIds: [],
            grade: null,
            GradeSubjectIds: [],
            gradeSubjects: [],
          });
        },
      },
      {
        name: 'university',
        defaultValue: null,
        label: t('instructors.university-choice'),
        type: 'select',
        required: typeInstructorSelected === 0,
        md: 12,
        options: allUniversity?.data ?? [],
        disabled: isLoading,
        onChange: (university) =>
          setUniversityId(Number((university as any)?.id)),
        hidden: typeInstructorSelected !== 0,
      },
      {
        name: 'colleges',
        defaultValue: null,
        label: t('instructors.colleges-choice'),
        type: 'select',
        required: universityId !== undefined,
        md: 12,
        options: allColleges?.data ?? [],
        disabled: isLoading,
        onChange: (college) => setCollegeId(Number((college as any)?.id)),
        hidden: universityId === undefined,
      },
      {
        name: 'CollegeDetailsSubjectIds',
        defaultValue: [],
        label: t('instructors.subjects'),
        type: 'select',
        required: collegeId !== undefined,
        md: 12,
        options: allSubjects?.data.flatMap((e) => e.subjects) ?? [],
        isMulti: true,
        disabled: isLoading,
        hidden: collegeId === undefined,
      },
      {
        name: 'grade',
        defaultValue: null,
        label: t('instructors.class-choice'),
        type: 'select',
        required: typeInstructorSelected === 1,
        md: 12,
        options: gradeLevel?.data ?? [],
        disabled: isLoading,
        onChange: (grade) => setGradeId(Number((grade as any)?.id)),
        hidden: typeInstructorSelected !== 1,
      },
      {
        name: 'GradeSubjectIds',
        defaultValue: [],
        label: t('subjects.subjects'),
        type: 'select',
        required: gradeId !== undefined,
        md: 12,
        disabled: isLoading,
        options:
          educationalLevels?.data.flatMap((e) => ({
            id: e.id,
            name: e.subject.name,
          })) ?? [],
        isMulti: true,
        hidden: gradeId === undefined,
      },
      {
        name: 'userName',
        defaultValue: editItem?.userName || '',
        label: t('instructors.username'),
        type: 'text',
        // eslint-disable-next-line no-unneeded-ternary
        required: editItem?.id ? false : true,
        hidden: !!editItem?.id,
        md: 12,
      },
      {
        name: 'fullName',
        defaultValue: editItem?.fullName || '',
        label: t('instructors.fullName'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'aboutInstructor',
        defaultValue: editItem?.aboutInstructor || '',
        label: t('instructors.aboutInstructor'),
        type: 'text',
        required: true,
        md: 12,
      },

      {
        name: 'birthDate',
        defaultValue: editItem?.birthDate
          ? editItem.birthDate.toString()
          : null,
        label: t('instructors.birthdate'),
        type: 'date',
        // required: true,
        md: 12,
      },
      {
        name: 'password',
        defaultValue: '',
        label: t('rooms.password'),
        type: 'text',
        // eslint-disable-next-line no-unneeded-ternary
        required: editItem?.id ? false : true,
        min: editItem?.id ? 0 : 6,
        isPassword: true,
        md: 12,
        hidden: !!editItem?.id,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  useEffect(() => {
    if (!editItem) return;
    setLoading(true);
    instructorApi
      .getInstructorById(editItem.id)
      .then((data) => {
        setTypeInstructorSelected(data.type);
        setGradeId(data?.gradeSubjects[0]?.grade?.id);
        setUniversityId(data?.university?.id);
        setCollegeId(data?.collegeDetailsSubjects[0]?.collegeId);
        reset({
          ...data,
          // university:data.university,
          Type: {
            id: typeInstructor[data.type].id,
            name: typeInstructor[data.type].name,
          },
          CollegeDetailsSubjectIds: data?.collegeDetailsSubjects?.map((s) => ({
            id: s?.collegeDetailsSubjectId,
            name: s?.name,
          })),
          grade: data?.gradeSubjects[0]?.grade,
          GradeSubjectIds: data?.gradeSubjects?.flatMap((s) => ({
            id: s?.subject?.gradeSubjectId,
            name: s?.subject?.name,
          })),
          university: data?.university,
          colleges: {
            id: data?.collegeDetailsSubjects[0]?.collegeId,
            name: data?.collegeDetailsSubjects[0]?.collegeName,
          },
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return GenericForm;
}

export default InstructorForm;
