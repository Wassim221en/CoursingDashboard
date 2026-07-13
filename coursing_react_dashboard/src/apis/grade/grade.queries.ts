import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import gradeApi from './grade.api';
import { IGetAllGradesPayload } from './grade.interfaces';

const useGradesQuery = (
  params?: IPaginationParams,
  disabled: boolean = false,
) => {
  const queryResult = useQuery(
    ['get-grades', params],
    () => gradeApi.getAllGrades(params),
    {
      enabled: !disabled,
    },
  );
  return queryResult;
};

const useGradeSubjectsQuery = (
  payload: IGetAllGradesPayload,
  disabled: boolean,
) => {
  const queryResult = useQuery(
    ['get-grade-subjects', payload],
    () => gradeApi.getAllGradeSubjects(payload),
    { enabled: !disabled },
  );
  return queryResult;
};

const useGradeDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-grade-by-id', id],
    () => gradeApi.getGradeById(id),
    {
      enabled: !!id,
      cacheTime: 0,
    },
  );
  return queryResult;
};

const useGradeSubjectDetailsQuery = (id: number, disabled?: boolean) => {
  const queryResult = useQuery(
    ['get-grade-subject-by-id', id],
    () => gradeApi.getGradeSubjectById(id),
    {
      enabled: !!disabled,
      cacheTime: 0,
    },
  );
  return queryResult;
};

const gradeQueries = {
  useGradesQuery,
  useGradeSubjectsQuery,
  useGradeDetailsQuery,
  useGradeSubjectDetailsQuery,
};

export default gradeQueries;
