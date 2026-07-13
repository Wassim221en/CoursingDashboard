import { useQuery } from '@tanstack/react-query';
import getKnowingSourceStatistics from './Invitation-source.api';

const useKnowingSourceStatisticsQuery = () => {
  const queryResult = useQuery(['get-all-KnowingSourceStatistics'], () =>
    getKnowingSourceStatistics(),
  );
  return queryResult;
};

export default useKnowingSourceStatisticsQuery;
