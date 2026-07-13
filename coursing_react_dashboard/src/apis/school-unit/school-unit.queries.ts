import { useQuery } from '@tanstack/react-query';
import {
  IGetSchoolUnitsPayload,
  IGradesSubjectUnitPayload,
} from './school-unit.interfaces';
import schoolUnitApi from './school-unit.api';

const useSchoolUnitsQuery = (
  payload?: IGetSchoolUnitsPayload,
  disabled?: boolean,
) => {
  const queryResult = useQuery(
    ['get-school-units', payload],
    () => schoolUnitApi.getAllSchoolUnits(payload),
    {
      enabled: !disabled,
    },
  );
  return queryResult;
};

const useSchoolUnitDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-school-unit-by-id', id],
    () => schoolUnitApi.getSchoolUnitById(id),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};

const useGradeSubjectUnitsQuery = (
  payload: IGradesSubjectUnitPayload,
  disabled: boolean = true,
) => {
  const queryResult = useQuery(
    ['get-grade-subject-units', payload],
    () => schoolUnitApi.getGradesSubjectUnit(payload),
    {
      enabled: !!disabled,
    },
  );

  return queryResult;
};

const schoolUnitQueries = {
  useSchoolUnitDetailsQuery,
  useGradeSubjectUnitsQuery,
  useSchoolUnitsQuery,
};

export default schoolUnitQueries;
