import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import educationalLevelApi from './educational-level.api';
import { IGetEducationalLevelPayload } from './educational-level.interfaces';

const useEducationalLevelsQuery = (payload?: IGetEducationalLevelPayload) => {
  const queryResult = useQuery(['get-educational-levels', payload], () =>
    educationalLevelApi.getAllEducationalLevels(payload),
  );
  return queryResult;
};

const useEducationalLevelDetailsQuery = (
  id: number,
  pagination: IPaginationParams,
) => {
  const queryResult = useQuery(
    ['get-educationalLevel-by-id', id],
    () => educationalLevelApi.getEducationalLevelById(id, pagination),
    {
      enabled: !!id,
    },
  );
  return queryResult;
};

const educationalLevelQueries = {
  useEducationalLevelDetailsQuery,
  useEducationalLevelsQuery,
};

export default educationalLevelQueries;
