import { useQuery } from '@tanstack/react-query';
import StatisticsApis from './statistics.api';

const useStatisticsQuery = () => {
  const queryResult = useQuery(['get-all-statistics'], () =>
    StatisticsApis.getAllStatistics(),
  );

  return queryResult;
};

const statisticsQueries = {
  useStatisticsQuery,
};

export default statisticsQueries;
