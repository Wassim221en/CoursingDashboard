import { useQuery } from '@tanstack/react-query';
import subjectApi from './college-subject.api';
import { IGetCollegeSubjectPayload } from './college-subject.interfaces';

const useCollegeSubjectsQuery = (
  payload?: IGetCollegeSubjectPayload,
  disabled?: boolean,
) => {
  const queryResult = useQuery(
    ['get-college-subjects', payload],
    () => subjectApi.getAllCollegeSubjects(payload),
    { enabled: !disabled },
  );
  return queryResult;
};

const useCollegeSubjectDetailsQuery = (id: number, disabled?: boolean) => {
  const queryResult = useQuery(
    ['get-college-subject-by-id', id],
    () => subjectApi.getCollegeSubjectById(id),
    {
      enabled: !!disabled,
    },
  );
  return queryResult;
};

const useCollegeSubjectDetailsUnitQuery = (id: number, disabled: boolean) => {
  const queryResult = useQuery(
    ['get-college-subject-details-units'],
    () => subjectApi.getCollegeSubjectDetailsUnit(id),
    {
      enabled: !!disabled,
    },
  );
  return queryResult;
};

const collegeSubjectQueries = {
  useCollegeSubjectsQuery,
  useCollegeSubjectDetailsQuery,
  useCollegeSubjectDetailsUnitQuery,
};

export default collegeSubjectQueries;
