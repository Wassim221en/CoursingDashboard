import CoursingApiInstance from 'apis/coursing-api.instance';
import { IStatistics } from './statistics.interfaces';
import { StatisticsApiRoutes } from './statistics.api-routes';

const getAllStatistics = async () => {
  const { data } = await CoursingApiInstance.get<IStatistics>(
    StatisticsApiRoutes.GetAll,
  );

  return data;
};

const StatisticsApis = {
  getAllStatistics,
};

export default StatisticsApis;
