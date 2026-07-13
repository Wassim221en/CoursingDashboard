import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import {
  IRequestPaper,
  IRequestPaperPayload,
} from './request-paper.interfaces';
import { RequestPaperApiRoutes } from './request-paper-api-routes';

const getAllPaperRequsets = async (payload: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<IRequestPaper[]>>(
    RequestPaperApiRoutes.GETALL,
    {
      params: payload,
    },
  );

  return data;
};

const updatePaperRequestStatus = async (payload: IRequestPaperPayload) => {
  const { data } = await CoursingApiInstance.put(
    RequestPaperApiRoutes.UPDATESTATUS,
    null,
    { params: payload },
  );
  return data;
};

const RequestPaperApis = {
  getAllPaperRequsets,
  updatePaperRequestStatus,
};

export default RequestPaperApis;
