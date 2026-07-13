import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import { useQuery } from '@tanstack/react-query';
import graduationProjectApi from './graduation-project.api';
import { IGetGraduationProjectPayload } from './graduation-project.interfaces';

const useGraduationProjectByGradeIdQuery = (
  payload: IGetGraduationProjectPayload & IPaginationParams,
) => {
  const queryResult = useQuery(
    ['get-graduation-project-by-grade-id', payload],
    () => graduationProjectApi.getAllGraduationProjectByGradeId(payload),
  );
  return queryResult;
};

const useGraduationProjectDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-graduation-project-by-id', id],
    () => graduationProjectApi.getGraduationProjectById(id),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};

const graduationProjectQueries = {
  useGraduationProjectDetailsQuery,
  useGraduationProjectByGradeIdQuery,
};

export default graduationProjectQueries;
