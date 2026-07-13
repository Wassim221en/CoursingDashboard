import { useQuery } from '@tanstack/react-query';
import specializedApi from './specialized.api';

const useSpecializedQuery = (disabled?: boolean) => {
  const queryResult = useQuery(
    ['get-specialized'],
    () => specializedApi.getAllSpecialized(),
    {
      enabled: !disabled,
    },
  );
  return queryResult;
};

const useSpecializedDetailsQuery = (id: number, disabled: boolean = false) => {
  const queryResult = useQuery(
    ['get-specialized-by-id', id],
    () => specializedApi.getSpecializedById(id),
    {
      enabled: !!disabled,
    },
  );
  return queryResult;
};

const useSpecializedQuestionsByIdQuery = (
  id: number,
  disabled: boolean = false,
) => {
  const queryResult = useQuery(
    ['get-specialized-by-id', id],
    () => specializedApi.GetByIdWithQuestion(id),
    {
      enabled: !!disabled,
    },
  );
  return queryResult;
};

const useSpecializedQuestionQuery = (disabled: boolean) => {
  const queryResult = useQuery(
    ['get-all-specialized-question'],
    () => specializedApi.GetAllSpecializedWithQuestion(),
    {
      enabled: !!disabled,
    },
  );

  return queryResult;
};

const specializedQueries = {
  useSpecializedDetailsQuery,
  useSpecializedQuery,
  useSpecializedQuestionQuery,
  useSpecializedQuestionsByIdQuery,
};

export default specializedQueries;
