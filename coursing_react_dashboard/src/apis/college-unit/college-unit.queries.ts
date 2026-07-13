import { useQuery } from '@tanstack/react-query';
import { IGetCollegeUnitsPayload } from './college-unit.interfaces';
import unitApi from './college-unit.api';

const useUnitsQuery = (
  payload?: IGetCollegeUnitsPayload,
  disabled?: boolean,
) => {
  const queryResult = useQuery(
    ['get-college-units', payload],
    () => unitApi.getAllCollegeUnits(payload),
    {
      enabled: !disabled,
    },
  );
  return queryResult;
};

const useUnitDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-college-unit-by-id', id],
    () => unitApi.getCollegeUnitById(id),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};

const collegeUnitQueries = {
  useUnitDetailsQuery,
  useUnitsQuery,
};

export default collegeUnitQueries;
