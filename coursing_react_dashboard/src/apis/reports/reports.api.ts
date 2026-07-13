import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import CoursingApiInstance from 'apis/coursing-api.instance';
import { reportTypes } from 'constants/constants';
import { ReportsApiRoutes } from './reports.api-routes';
import { IGetReportsPayload, IReport } from './reports.interfaces';

const getAllReports = async (
  payload: IPaginationParams & IGetReportsPayload,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<IReport[]>>(
    ReportsApiRoutes.GetAll,
    {
      params: payload,
    },
  );
  return data;
};

const removeReport = async (id: number, section: string) => {
  const { data } = await CoursingApiInstance.delete(ReportsApiRoutes.remove, {
    params: { id, section },
  });

  return data;
};

const markAllReportsAsRead = async (
  id: number | undefined,
  type: reportTypes,
) => {
  const { data } = await CoursingApiInstance.get(
    ReportsApiRoutes.markAllReportsAsRead,
    { params: { id, type } },
  );
  return data;
};

const ReportsApis = {
  getAllReports,
  removeReport,
  markAllReportsAsRead,
};

export default ReportsApis;
