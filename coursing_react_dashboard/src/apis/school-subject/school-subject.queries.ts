import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import { useQuery } from '@tanstack/react-query';
import subjectApi from './school-subject.api';
import { IGetSchoolSubjectPayload } from './school-subject.interfaces';

const useSchoolSubjectsQuery = (
  payload?: IGetSchoolSubjectPayload & IPaginationParams,
  disabled?: boolean,
) => {
  const queryResult = useQuery(
    ['get-school-subjects', payload],
    () => subjectApi.getAllSchoolSubjects(payload),
    {
      enabled: !disabled,
    },
  );
  return queryResult;
};

const useSchoolSubjectDetailsQuery = (id: number, disabled: boolean) => {
  const queryResult = useQuery(
    ['get-school-subject-by-id', id],
    () => subjectApi.getSchoolSubjectById(id),
    {
      enabled: !!disabled,
    },
  );
  return queryResult;
};

const schoolSubjectQueries = {
  useSchoolSubjectDetailsQuery,
  useSchoolSubjectsQuery,
};

export default schoolSubjectQueries;
